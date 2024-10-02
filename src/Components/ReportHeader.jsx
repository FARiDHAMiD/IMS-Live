import { useCallback, useState } from "react";
import { FaFileCsv, FaPrint } from "react-icons/fa6";
import { useTheme } from "../context/ThemeProvider";

const ReportHeader = (props) => {
  let { reportTitle, gridRef } = props;
  let {theme} = useTheme()
  let [printing, setPrinting] = useState(false);

  // global filter searching ...
  // global search
  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      "quickFilterText",
      document.getElementById("filter-text-box").value
    );
  }, []);

  //export csv ** ag-grid **
  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  // printing using ** ag-grid **
  // print preview
  const setPrinterFriendly = (api) => {
    const eGridDiv = document.querySelector("#myGrid");
    eGridDiv.style.width = "";
    eGridDiv.style.height = "";
    api.setGridOption("domLayout", "print");
  };

  // normal preview
  const setNormal = (api) => {
    const eGridDiv = document.querySelector("#myGrid");
    eGridDiv.style.width = "100%";
    eGridDiv.style.height = "600px";
    api.setGridOption("domLayout", undefined);
  };

  // print function
  const onBtPrint = useCallback(() => {
    setPrinterFriendly(gridRef.current.api);
    setPrinting(true);
    setTimeout(() => {
      print();
      setNormal(gridRef.current.api);
      setPrinting(false);
    }, 500);
  }, [print]);

  return (
    <div className="row">
      <h2 className="text-center" id="printHeader" hidden={!printing && true}>
        {reportTitle}
      </h2>
      <div className="col-6 my-2">
        <h3 className={theme == 'dark' ? 'text-warning' : 'text-navy'}>{reportTitle}</h3>
      </div>
      <div className="col-5 d-flex justify-content-end">
        <input
          className="form-control my-2"
          type="text"
          id="filter-text-box"
          placeholder="بحث..."
          onInput={onFilterTextBoxChanged}
        />
      </div>
      <div className="col-md-1 d-flex justify-content-end">
        <button className="btn btn-sm" onClick={onBtPrint}>
          <FaPrint size={25} />
        </button>
        <button className="btn btn-sm" onClick={onBtnExport}>
          <FaFileCsv size={25} />
        </button>
      </div>
    </div>
  );
};

export default ReportHeader;
