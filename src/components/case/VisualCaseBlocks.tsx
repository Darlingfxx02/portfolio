export type SignalItem = {
  signal: string;
  label: string;
  note?: string;
};

export function SignalMap({
  center,
  items,
  ariaLabel,
}: {
  center: string;
  items: [SignalItem, SignalItem, SignalItem, SignalItem];
  ariaLabel: string;
}) {
  return (
    <figure className="case-signal-map" aria-label={ariaLabel}>
      <svg
        className="case-signal-map__lines"
        viewBox="0 0 640 380"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M320 190 L132 92" />
        <path d="M320 190 L508 92" />
        <path d="M320 190 L132 288" />
        <path d="M320 190 L508 288" />
      </svg>
      <div className="case-signal-map__grid">
        {items.map((item, index) => (
          <div className="case-signal-map__node" key={`${item.signal}-${item.label}`}>
            <span className="case-signal-map__signal">{item.signal}</span>
            <strong>{item.label}</strong>
            {item.note && <span className="case-signal-map__note">{item.note}</span>}
            <span className="case-signal-map__index" aria-hidden="true">
              0{index + 1}
            </span>
          </div>
        ))}
      </div>
      <div className="case-signal-map__center">{center}</div>
    </figure>
  );
}

export type FlowItem = {
  value: string;
  label: string;
};

export function FlowLine({
  items,
  ariaLabel,
}: {
  items: [FlowItem, FlowItem, FlowItem];
  ariaLabel: string;
}) {
  return (
    <figure className="case-flow-line" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <div className="case-flow-line__step" key={`${item.value}-${item.label}`}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
          {index < items.length - 1 && (
            <span className="case-flow-line__arrow" aria-hidden="true">
              →
            </span>
          )}
        </div>
      ))}
    </figure>
  );
}

export function ScopeSplit({
  leftLabel,
  leftItems,
  rightLabel,
  rightItems,
  ariaLabel,
}: {
  leftLabel: string;
  leftItems: string[];
  rightLabel: string;
  rightItems: string[];
  ariaLabel: string;
}) {
  return (
    <figure className="case-scope-split" aria-label={ariaLabel}>
      <ScopeSide label={leftLabel} items={leftItems} side="left" />
      <div className="case-scope-split__axis" aria-hidden="true">
        <span />
      </div>
      <ScopeSide label={rightLabel} items={rightItems} side="right" />
    </figure>
  );
}

function ScopeSide({
  label,
  items,
  side,
}: {
  label: string;
  items: string[];
  side: "left" | "right";
}) {
  return (
    <div className={`case-scope-split__side case-scope-split__side--${side}`}>
      <p>{label}</p>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            <span aria-hidden="true">0{index + 1}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
