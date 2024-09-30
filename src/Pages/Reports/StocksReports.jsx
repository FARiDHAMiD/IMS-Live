import { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import Spinner from "../../Components/Spinner";
import { useNavigate } from "react-router-dom";
import ReportHeader from "../../Components/ReportHeader";
import "./ag-grid.css";
import dayjs from "dayjs";

const StocksReports = () => {
  const gridRef = useRef();
  let [stocks, setStocks] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // stocks report data
  let getStocks = async () => {
    let response = await AxiosInstance.get(`stock/`);
    setStocks(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getStocks();
  }, []);

  let editStock = (id) => {
    navigate(`/control/stock/${id}`);
  };

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 50, 100];

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      headerName: "",
      valueGetter: "node.rowIndex + 1",
    },
    {
      field: "name",
      headerName: "المخزن",
    },
    {
      field: "location",
      headerName: "العنوان",
    },
    {
      field: "keeper",
      headerName: "أمين المخزن",
    },
    {
      field: "credit.total",
      headerName: "الرصيد",
      valueFormatter: (p) => p.value && "EGP " + p.value.toLocaleString(),
    },
    {
      field: "isActive",
      headerName: "مفعل / معطل",
    },
  ]);

  // custom row class
  const rowClassRules = {
    "text-warning": (p) => p.data.credit < 0,
  };

  return (
    <div className="container-fluid">
      <ReportHeader reportTitle={`المخازن`} gridRef={gridRef} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* // wrapping container with theme & size */}
          <div
            id="myGrid"
            className="ag-theme-quartz-dark" // applying the Data Grid theme
            style={{ height: 500 }} // the Data Grid will fill the size of the parent container
          >
            <AgGridReact
              columnDefs={colDefs}
              rowData={stocks}
              rowClassRules={rowClassRules}
              onRowClicked={(e) => {
                editStock(e.data.id);
              }}
              autoSizeStrategy={{ type: "fitCellContents" }}
              pagination={pagination}
              paginationPageSize={paginationPageSize}
              paginationPageSizeSelector={paginationPageSizeSelector}
              enableRtl={true}
              autoSizeAllColumns={true}
              ref={gridRef}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StocksReports;
