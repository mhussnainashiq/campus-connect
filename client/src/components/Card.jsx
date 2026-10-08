function Card({
  children,
  title,
  description,
  className = "",
  padding = "medium",
}) {
  const classes = [
    "ui-card",
    `ui-card-padding-${padding}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      {(title || description) && (
        <div className="ui-card-header">
          {title && <h3>{title}</h3>}

          {description && <p>{description}</p>}
        </div>
      )}

      <div className="ui-card-content">
        {children}
      </div>
    </section>
  );
}

export default Card;