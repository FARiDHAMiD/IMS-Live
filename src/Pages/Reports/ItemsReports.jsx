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

const ItemsReports = () => {
  const gridRef = useRef();
  let [items, setItems] = useState([]);
  let [loading, setLoading] = useState(true);
  let navigate = useNavigate();

  // items report data
  let getItems = async () => {
    let response = await AxiosInstance.get(`item/`);
    setItems(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getItems();
  }, []);

  let editItem = (id) => {
    navigate(`/control/item/${id}`);
  };

  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [20, 50, 100];

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    {
      headerName: "#",
      valueGetter: "node.rowIndex + 1",
      pinned: 'right'
    },
    {
      field: "cat",
      headerName: "الفئة",
      filter: true,
    },
    {
      field: "name",
      headerName: "الصنف",
      pinned: "right",
    },
    {
      field: "qty",
      headerName: "الكمية",
      valueGetter: (p) =>
        p.data.qty +
        " " +
        p.data.scale_unit +
        " / " +
        p.data.qty * p.data.small_in_large +
        " " +
        p.data.small_unit,
      cellClass: (p) => p.data.qty < p.data.min_limit && "text-warning",
    },
    {
      field: "min_limit",
      headerName: "حد الطلب",
      valueGetter: (p) => p.data.min_limit + " " + p.data.scale_unit,
    },
    {
      field: "purchasing_price",
      headerName: "شراء",
      valueFormatter: (p) => "£" + p.value.toLocaleString(),
    },
    {
      field: "selling_price",
      headerName: "جملة",
      editable: true,
      valueFormatter: (p) => "£" + p.value.toLocaleString(),
    },
    {
      field: "retail_price",
      headerName: "قطاعى",
      editable: true,
      valueFormatter: (p) => "£" + p.value.toLocaleString(),
    },
    {
      field: "last_order_time",
      headerName: "آخر طلب",
      valueFormatter: (p) => dayjs(p.value).format("YYYY/MM/DD"),
    },
  ]);

  // custom row class
  const rowClassRules = {};

  return (
    <div className="container-fluid">
      <ReportHeader reportTitle={`الأصناف`} gridRef={gridRef} />
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
              rowData={items}
              rowClassRules={rowClassRules}
              onRowClicked={(e) => {
                editItem(e.data.id);
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

export default ItemsReports;
