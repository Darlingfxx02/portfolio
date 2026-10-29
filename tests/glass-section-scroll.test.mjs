import assert from 'node:assert/strict'
import { test } from 'node:test'
import { adjacentSection, navigationArrival, sectionEdgeDirection, sectionScrollPosition } from '../src/lib/sectionScroll.ts'

const sections = ['home', 'explorations', 'work', 'about']

test('menu ends cannot wrap across intermediate sections', () => {
  assert.equal(adjacentSection(sections, 'home', 'backward'), undefined)
  assert.equal(adjacentSection(sections, 'about', 'forward'), undefined)
  assert.equal(adjacentSection(sections, 'missing', 'forward'), undefined)
})

test('each scroll transition enters the immediate neighbor in the menu', () => {
  for (let i = 0; i < sections.length - 1; i++) {
    assert.equal(adjacentSection(sections, sections[i], 'forward'), sections[i + 1])
    assert.equal(adjacentSection(sections, sections[i + 1], 'backward'), sections[i])
  }
})

test('scrolling inside a section stays native in both directions', () => {
  for (const position of [3, 100, 500, 997]) {
    assert.equal(sectionEdgeDirection(44, position, 1000), null)
    assert.equal(sectionEdgeDirection(-44, position, 1000), null)
  }
  assert.equal(sectionEdgeDirection(0, 0, 1000), null)
})

test('only scrolling out of the matching edge navigates, including fractional scroll positions', () => {
  assert.equal(sectionEdgeDirection(44, 999.6, 1000), 'forward')
  assert.equal(sectionEdgeDirection(-44, 999.6, 1000), null)
  assert.equal(sectionEdgeDirection(-44, 0.4, 1000), 'backward')
  assert.equal(sectionEdgeDirection(44, 0.4, 1000), null)
})

test('after a forward transition the continuing input scrolls each new section to the bottom', () => {
  for (const max of [580, 4456, 351]) {
    const arrival = sectionScrollPosition('top', max, max)
    assert.equal(arrival, 0)
    for (let position = arrival; position < max - 2; position += 44) {
      assert.equal(sectionEdgeDirection(44, position, max), null,
        'The same uninterrupted input remains native throughout the new page')
    }
    assert.equal(sectionEdgeDirection(44, max, max), 'forward')
  }
})

test('after a backward transition the continuing input scrolls each new section to the top', () => {
  for (const max of [351, 4456, 580]) {
    const arrival = sectionScrollPosition('bottom', max, 0)
    assert.equal(arrival, max)
    for (let position = arrival; position > 2; position -= 44) {
      assert.equal(sectionEdgeDirection(-44, position, max), null,
        'Backward navigation must not arrive at the outgoing top edge')
    }
    assert.equal(sectionEdgeDirection(-44, 0, max), 'backward')
  }
})

test('sections fitting in the viewport can navigate either way without an input lock', () => {
  assert.equal(sectionScrollPosition('bottom', -20, 0), 0)
  assert.equal(sectionEdgeDirection(44, 0, 0), 'forward')
  assert.equal(sectionEdgeDirection(-44, 0, 0), 'backward')
})

test('non-menu section returns keep saved positions within the current page bounds', () => {
  assert.equal(sectionScrollPosition('saved', 1000, 400), 400)
  assert.equal(sectionScrollPosition('saved', 1000, 1500), 1000)
  assert.equal(sectionScrollPosition('saved', 1000, -30), 0)
})

test('reopened cases ignore saved positions for links, history and either scroll direction', () => {
  for (const hash of ['#case/ovork', '#case/uxart', '#case/zinda']) {
    for (const navigation of ['restore', 'menu', 'forward', 'backward']) {
      for (const saved of [0, 850, 9000]) {
        assert.equal(sectionScrollPosition(navigationArrival(hash, navigation), 9000, saved), 0)
      }
    }
  }
})

test('menu selections start sections at the top even after a bottom or mid-page visit', () => {
  for (const section of sections) {
    for (const saved of [600, 4000]) {
      assert.equal(sectionScrollPosition(navigationArrival(`#${section}`, 'menu'), 4000, saved), 0)
    }
  }
})

test('section gestures preserve directional arrivals independently of saved positions', () => {
  for (const section of sections) {
    const hash = `#${section}`
    assert.equal(sectionScrollPosition(navigationArrival(hash, 'forward'), 4000, 900), 0)
    assert.equal(sectionScrollPosition(navigationArrival(hash, 'backward'), 4000, 900), 4000)
    assert.equal(sectionScrollPosition(navigationArrival(hash, 'restore'), 4000, 900), 900)
  }
})
