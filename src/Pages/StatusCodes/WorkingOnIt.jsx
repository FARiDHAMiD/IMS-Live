import { FaTriangleExclamation } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const WorkingOnIt = () => {
  let navigate = useNavigate();
  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="col-md-8 col-10 mt-2">
          {/* work on admin ticket  */}
          <div className="card p-3" style={{ alignItems: "center" }}>
            <h4 className="mt-2">
              ... Working On It{" "}
              <FaTriangleExclamation
                size={30}
                style={{ alignContent: "center" }}
                className="text-warning mb-0"
              />
            </h4>

            <img
              style={{
                width: "70%",
                height: "auto",
              }}
              src="../working.jpg"
              alt=""
              width={400}
            />
            <div className="my-2">
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                عودة
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkingOnIt;
