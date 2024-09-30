import { useState, useEffect, useRef } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import Spinner from "../../Components/Spinner";
import { useNavigate } from "react-router-dom";
import ReportHeader from "../../Components/ReportHeader";
import "./ag-grid.css";

const AccountsReports = () => {
  const gridRef = useRef();
  let [accounts, setAccounts] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // accounts report data
  let getAccounts = async () => {
    let response = await AxiosInstance.get(`account/`);
    setAccounts(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getAccounts();
  }, []);

  let editAccount = (id) => {
    navigate(`/control/account/${id}`);
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
      headerName: "الحساب",
    },
    {
      field: "phone1",
      headerName: "التواصل",
      valueGetter: (p) => p.data.phone1 + " - " + p.data.address,
    },
    {
      field: "account_type",
      headerName: "نوع الحساب",
    },
    {
      field: "credit",
      headerName: "الرصيد",
      cellClassRules: {
        // apply green to electric cars
        "text-warning": (params) => params.value < 0,
      },
      editable: true,
      valueFormatter: (p) => "" + p.value.toLocaleString(),
    },
    {
      field: "isActive",
      headerName: "عدد المعاملات",
    },
  ]);

  // custom row class
  const rowClassRules = {
    "text-warning": (p) => p.data.credit < 0,
  };

  return (
    <div className="container-fluid">
      <ReportHeader reportTitle={`العملاء`} gridRef={gridRef} />
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
              rowData={accounts}
              rowClassRules={rowClassRules}
              onRowClicked={(e) => {
                editAccount(e.data.id);
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

export default AccountsReports;
