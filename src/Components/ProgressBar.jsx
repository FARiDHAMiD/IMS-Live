const ProgressBar = ({ width, bg_class, striped }) => {
  return (
    <div className="progress">
      <div
        className={`progress-bar progress-bar-${striped} progress-bar-animated ${bg_class}`}
        role="progressbar"
        style={{ width: `${width}%` }}
      >
        {width}%
      </div>
    </div>
  );
};

export default ProgressBar;
