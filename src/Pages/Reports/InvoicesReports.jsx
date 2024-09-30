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

const InvoicesReports = () => {
  const gridRef = useRef();
  let [invoices, setInvoices] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // invoices report data
  let getInvoices = async () => {
    let response = await AxiosInstance.get(`invoiceReport/`);
    setInvoices(response.data);
    setLoading(false);
  };

  let getInvoice = (id) => {
    navigate(`/invoice/preview/${id}`);
  };

  useEffect(() => {
    getInvoices();
  }, []);

  // filter invoice datetime
  var filterDateParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split("/");
      var cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2000,
    maxValidYear: 2030,
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };

  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [20, 50, 100];

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
    },
    {
      field: "invoice_no",
      headerName: "رقم",
    },
    {
      field: "type",
      headerName: "النوع",
    },
    {
      field: "total",
      headerName: "قيمة الفاتورة",
      valueFormatter: (p) => "EGP " + p.value.toLocaleString(),
    },
    {
      field: "invoice_by",
      headerName: "المستخدم",
    },
    {
      field: "invoice_time",
      headerName: "التوقيت",
      valueFormatter: (p) => dayjs(p.value).format("YYYY/MM/DD h:mma"),
      filter: "agDateColumnFilter",
      filterParams: filterDateParams,
    },
    {
      field: "account",
      headerName: "العميل",
    },
    {
      field: "pay_type",
      headerName: "طريقة الدفع",
    },
  ]);

  return (
    <div className="container-fluid">
      <ReportHeader reportTitle={`الفواتير`} gridRef={gridRef} />
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
              rowData={invoices}
              //   rowClassRules={rowClassRules}
              onRowClicked={(e) => {
                getInvoice(e.data.id);
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

export default InvoicesReports;
