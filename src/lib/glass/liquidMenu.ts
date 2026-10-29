import { polygonClip, shapePolygon, Spring } from '@glass-sdk/liquid-glass/core'
import { resolveMotion, type GeometryAnimator, type LensFrame, type LensWaypoint } from '@glass-sdk/liquid-glass/dom'
import { smooth } from './liquidFlow.ts'
import { menuBodyPath, planMenu, sampleMenu, type MenuPlan } from './liquidMenuFlow.ts'

type Elements = {
  scene: () => HTMLElement | null
  trigger: () => HTMLElement | null
  menu: () => HTMLElement | null
  panel: () => HTMLElement | null
  tint: () => SVGPathElement | null
  blueTint: () => SVGRectElement | null
  back?: () => HTMLElement | null
}
type Binding = { prepared: (shape: LensWaypoint) => boolean }
type Sample = ReturnType<typeof sampleMenu>
const plans = new Map<string, MenuPlan>()
const attribute = (element: Element | null, name: string, value: string) => {
  if (element && element.getAttribute(name) !== value) element.setAttribute(name, value)
}
const style = (element: HTMLElement, name: string, value: string) => {
  if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value)
}

/** One physical model drives the source, neck, panel, optics, tint and labels.
 * The primary surface owns the whole body while joined. Only after its neck
 * separates does the second surface draw the panel; no source copy is faded
 * behind a static, independently painted button.
 */
export function createLiquidMenu(elements: Elements) {
  const spring = new Spring(0, { duration: 0.56, bounce: 0 })
  const backSpring = new Spring(0, { duration: 0.56, bounce: 0 })
  const bindings: (Binding | undefined)[] = []
  let plan: MenuPlan | undefined
  let backPlan: MenuPlan | undefined
  let layoutKey = ''
  let paths: LensWaypoint[][] = [[], [], []]
  let fields: { sample: Sample; index: number; plan: MenuPlan; visible: boolean }[] = []
  let origin = { left: 0, top: 0 }
  let lastFrame = -1
  let lastTime = 0
  let waiting = false
  let notified = false

  function update(now: number) {
    if (lastFrame === now) return
    lastFrame = now
    const scene = elements.scene(), panel = elements.panel(), trigger = elements.trigger()
    if (!scene || !panel || !trigger) return
    const rect = scene.getBoundingClientRect()
    origin = { left: rect.left, top: rect.top }
    const layout = { size: scene.offsetWidth, width: panel.offsetWidth, height: panel.offsetHeight, gap: 10,
      placement: scene.getAttribute('data-menu-placement') === 'above' ? 'above' as const : 'below' as const }
    // Ref attachment and CSS replacement can briefly expose an unmeasured
    // panel. Keep the last field until ResizeObserver provides its real box.
    if (!layout.size || !layout.width || !layout.height) { lastTime = now; return }
    const key = JSON.stringify(layout)
    if (key !== layoutKey) {
      layoutKey = key
      const prepare = (value: Parameters<typeof planMenu>[0]) => {
        const cacheKey = JSON.stringify(value)
        let cached = plans.get(cacheKey)
        if (!cached) {
          cached = planMenu(value)
          if (plans.size >= 8) plans.delete(plans.keys().next().value!)
          plans.set(cacheKey, cached)
        }
        return cached
      }
      plan = prepare(layout)
      backPlan = prepare({ size: layout.size, width: layout.size, height: layout.size,
        gap: 10, placement: 'right', radius: layout.size / 2 })
      const shapes = (source: MenuPlan, index: number) =>
        source.stops.flatMap((stop) => stop.bodies[index] ? [stop.bodies[index].shape] : [])
      paths = [[...shapes(plan, 0), ...shapes(backPlan, 0)], shapes(plan, 1), shapes(backPlan, 1)]
    }
    if (!plan || !backPlan) return
    const open = scene.getAttribute('data-menu-open') === 'true'
    const showBack = scene.getAttribute('data-back-visible') === 'true'
    backSpring.target = showBack ? 1 : 0
    // Both motions draw mass from the same button. Finish closing the menu
    // before splitting/rejoining the arrow; never overlay two source fields.
    spring.target = open && backSpring.settled ? 1 : 0
    if (open) notified = false
    const dt = lastTime ? Math.min(0.04, Math.max(0, (now - lastTime) / 1000)) : 1 / 60
    lastTime = now
    const previous = [spring, backSpring].map(({ value, velocity }) => ({ value, velocity }))
    if (resolveMotion('full') !== 'full') {
      backSpring.jump(backSpring.target)
      spring.jump(open ? 1 : 0)
    } else {
      spring.step(dt)
      if (spring.value === 0) backSpring.step(dt)
    }
    const sampleFields = () => {
      const menuSample = sampleMenu(plan!, spring.value)
      const backSample = sampleMenu(backPlan!, backSpring.value)
      const fromBack = spring.value === 0 && backSpring.value > 0
      return [
        { sample: fromBack ? backSample : menuSample, index: 0, plan: fromBack ? backPlan! : plan!, visible: true },
        { sample: menuSample, index: 1, plan: plan!, visible: spring.value > 0 },
        { sample: backSample, index: 1, plan: backPlan!, visible: backSpring.value > 0 },
      ]
    }
    let next = sampleFields()
    waiting = next.some(({ sample: state, index, visible }, surface) => visible && state.pose.bodies[index] &&
      (!bindings[surface]?.prepared(state.a.bodies[index].shape) || !bindings[surface]?.prepared(state.b.bodies[index].shape)))
    // Shapes are prepared at rest. An immediate cold click waits at its last
    // complete field, keeping every visible layer together while maps warm.
    if (waiting && (!spring.settled || !backSpring.settled)) {
      ;[spring, backSpring].forEach((motion, index) => {
        motion.value = previous[index].value
        motion.velocity = previous[index].velocity
      })
      next = sampleFields()
    }
    fields = next
    const sample = fields[0].sample

    const d = fields.flatMap(({ sample: state, index, visible }) =>
      visible && state.pose.bodies[index] ? [menuBodyPath(state.pose.bodies[index])] : []).join('')
    const clip = `path("${d}")`
    if (scene.style.clipPath !== clip) scene.style.clipPath = clip
    attribute(elements.tint(), 'd', d)
    const { head, pull } = sample.pose
    const centerY = head.top + head.height / 2
    // The neutral fill follows the entire liquid body; blue belongs only to
    // its moving head, so it never spills onto the detached menu above/below.
    const blueTint = elements.blueTint()
    attribute(blueTint, 'x', String(head.left))
    attribute(blueTint, 'y', String(head.top))
    attribute(blueTint, 'width', String(head.width))
    attribute(blueTint, 'height', String(head.height))
    attribute(blueTint, 'rx', String(head.width / 2))
    const horizontal = fields[0].plan === backPlan
    style(trigger, 'translate', `${(horizontal ? head.left + head.width / 2 - layout.size / 2 : 1.5 * pull).toFixed(3)}px ${(centerY - layout.size / 2).toFixed(3)}px`)
    style(trigger, '--icon-scale', String(1 - 0.04 * pull))
    attribute(scene, 'data-liquid-menu-progress', spring.value.toFixed(4))
    attribute(scene, 'data-liquid-menu-state', spring.settled ? open ? 'open' : 'closed' : open ? 'opening' : 'closing')
    attribute(scene, 'data-liquid-back-progress', backSpring.value.toFixed(4))
    const back = elements.back?.()
    if (back) {
      const live = fields[2].sample.pose.panel
      const reveal = smooth(0.47, 0.88, backSpring.value)
      style(back, 'translate', `${(live.left + live.width / 2 - (layout.size * 1.5 + 10)).toFixed(3)}px ${(live.top + live.height / 2 - layout.size / 2).toFixed(3)}px`)
      style(back, 'opacity', String(reveal))
      style(back, 'visibility', reveal > 0 ? 'visible' : 'hidden')
      style(back, 'pointer-events', showBack && reveal > 0.85 ? 'auto' : 'none')
    }
    const menu = elements.menu()
    if (menu) {
      const livePanel = fields[1].sample.pose.panel
      const reveal = smooth(0.47, 0.88, spring.value)
      const restingTop = layout.placement === 'above' ? -layout.gap - layout.height : layout.size + layout.gap
      const outline = shapePolygon(livePanel.width, livePanel.height, Math.min(24, livePanel.height / 2))
        .map(([x, y]): [number, number] => [livePanel.left + x, livePanel.top - restingTop + y])
      style(menu, 'clip-path', polygonClip(outline))
      style(menu, 'opacity', String(reveal))
      style(menu, 'filter', `blur(${((1 - reveal) * 4).toFixed(2)}px)`)
      style(menu, '--menu-reveal', String(reveal))
    }
    if (!open && spring.settled && menu && !notified) {
      notified = true
      menu.dispatchEvent(new CustomEvent('glass:exited'))
    }
  }

  return {
    attach(index: 0 | 1 | 2, prepared: Binding['prepared']): GeometryAnimator {
      const binding = { prepared }
      bindings[index] = binding
      return {
        frame(now) { update(now); return !spring.settled || !backSpring.settled || waiting },
        geometry(): LensFrame | undefined {
          const field = fields[index]
          if (!field) return undefined
          const { sample, index: bodyIndex } = field
          const body = sample.pose.bodies[bodyIndex]
          if (!body) {
            const last = field.plan.stops.at(-1)!.bodies[bodyIndex]
            if (!last) return undefined
            return { left: origin.left + last.left, top: origin.top + last.top,
              width: last.width, height: last.height, radius: 0, outline: last.shape.outline }
          }
          const box = { left: origin.left + body.left, top: origin.top + body.top, width: body.width, height: body.height }
          return { ...box, radius: 0, outline: body.shape.outline, draw: {
            a: { ...box, shape: sample.a.bodies[bodyIndex].shape },
            b: { ...box, shape: sample.b.bodies[bodyIndex].shape }, mix: sample.mix,
          } }
        },
        waypoints: () => paths[index],
        pending: () => waiting,
        opacity: () => fields[index]?.visible && fields[index].sample.pose.bodies[fields[index].index] ? 1 : 0,
        detachedSource: () => undefined,
        positioning: () => false,
        dispose() {
          if (bindings[index] === binding) bindings[index] = undefined
        },
      }
    },
  }
}
