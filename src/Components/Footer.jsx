const Footer = () => {
  return (
    <>
      <div className="container" dir="ltr">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <p className="col-md-4 mb-0 text-muted">
            © 2024 Hesham Mansour, Inc.
          </p>

          <a
            href="/"
            className="col-md-4 d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
          >
            <img
              className="d-block mx-auto "
              src="../icon.png"
              alt=""
              width="40"
              height=""
            />
          </a>

          <ul className="nav col-md-4 justify-content-end">
            <li className="nav-item">
              <a
                target="_blank"
                href="https://www.linkedin.com/in/farid-7amid"
                className="nav-link px-2 text-muted"
              >
                Designed By <span className="text-info">Farid A. Hamid</span>
              </a>
            </li>
          </ul>
        </footer>
      </div>
    </>
  );
};

export default Footer;
