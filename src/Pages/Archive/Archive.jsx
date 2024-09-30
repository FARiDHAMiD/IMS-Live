import {
  FaCalendarXmark,
  FaCartArrowDown,
  FaFileCircleCheck,
  FaFileCircleQuestion,
  FaFileCircleXmark,
  FaStoreSlash,
  FaUserLock,
  FaUserXmark,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
const Archive = () => {
  const linkClass = ({ isActive }) => isActive && "active";

  const controlData = [
    {
      url: "accountArchive",
      label: "الحسابات المعطلة",
      icon: <FaUserXmark size={50} />,
    },
    {
      url: "stockArchive",
      label: "مخازن غير مفعلة",
      icon: <FaStoreSlash size={50} />,
    },
    {
      url: "../working",
      label: "مستخدم مغلق",
      icon: <FaUserLock size={50} />,
    },
    {
      url: "../working",
      label: "أصناف محذوفة",
      icon: <FaCartArrowDown size={50} />,
    },
    {
      url: "invoiceArchive",
      label: "الفواتير",
      icon: <FaFileCircleQuestion size={50} />,
    },
    {
      url: "../working",
      label: "شركات محذوفة",
      icon: <FaCalendarXmark size={50} />,
    },
  ];

  return (
    <div className="container mt-3">
      <div className="row d-flex justify-content-center">
        {controlData.map((data, index) => (
          <div key={index} className="col-md-4 mt-2">
            <Link
              to={`/control/${data.url}`}
              style={{ textDecoration: "none" }}
            >
              <div className="card p-3" style={{ alignItems: "center" }}>
                {data.icon}
                <h3 className="mt-2">{data.label}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
