import { NavLink } from "react-router-dom";
import ControlTable from "../../Components/ControlTable";
import { FaTriangleExclamation } from "react-icons/fa6";
import { useState } from "react";
import SearchBox from "../../Components/SearchBox";

const BasicDataControl = (props) => {
  const [input, setInput] = useState("");
  const { control, label } = props;
  const linkClass = ({ isActive }) => isActive && "active";

  const controlData = [
    { url: "itemCat", label: "فئات الأصناف" },
    { url: "itemUnit", label: "وحدات القياس" },
    { url: "itemType", label: "أنواع الأصناف" },
    { url: "payType", label: "طرق السداد" },
    { url: "accountType", label: "أنواع الحسابات" },
    { url: "invoiceType", label: "أنواع الفواتير" },
    { url: "company", label: "بيانات الشركات" },
  ];

  return (
    // default data
    <div className="text-center container mt-2">
      <div className="row">
        {/*  list  */}
        <div className="col-4">
          <div className="list-group" id="list-tab" role="tablist">
            {controlData.map((data) => (
              <NavLink
                key={data.url}
                className={`list-group-item list-group-item-action ${linkClass}`}
                to={`/control/${data.url}`}
              >
                {data.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* data tables  */}
        <div className="col-8">
          <div className="tab-content">
            <div className="tab-pane fade show active">
              <div className="card">
                {control ? (
                  <>
                    <div className="row">
                      <div className="col-md-9">
                        <SearchBox searchTxt={input} setSearchTxt={setInput} />
                      </div>
                      <div className="col-md-3">
                        <NavLink
                          to={`/control/defaultCreate/`}
                          state={{ url: control, label: label }}
                        >
                          <button
                            className="btn btn-success mt-2"
                            style={{ float: "left", marginLeft: "10px" }}
                          >
                            إضافة
                          </button>
                        </NavLink>
                      </div>
                    </div>
                    <ControlTable
                      controlData={control}
                      label={label}
                      search={input}
                    />
                  </>
                ) : (
                  <div className="card-body">
                    <FaTriangleExclamation
                      style={{ color: "yellow", fontSize: "xx-large" }}
                    />
                    <p>
                      أي تغيير او حذف فى البيانات الأساسية للنظام قد يؤثر على
                      بعض العمليات المتعلقة بنوع التغيير ; مثلاً: بيانات الأصناف
                      / حسابات العملاء / طرق الدفع .
                    </p>
                    <p>لمزيد من المعلومات برجاء التواصل مع الأدمن</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDataControl;
