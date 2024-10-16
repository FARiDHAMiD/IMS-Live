import { useTheme } from "../../context/ThemeProvider";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import AxiosInstance from "../../Components/AxiosInstance";
import {
  FaArrowLeft,
  FaArrowRight,
  FaFileInvoice,
  FaScroll,
} from "react-icons/fa6";
import Spinner from "../../Components/Spinner";

const InvoiceByItem = () => {
  let { theme } = useTheme();
  let [invoiceByItem, setInvoiceByItem] = useState([]);
  let [item, setItem] = useState([]);
  let [count, setCount] = useState(0);
  let [loading, setLoading] = useState(true);
  let { id } = useParams();

  let getItem = async () => {
    let response = await AxiosInstance.get(`item/${id}`);
    setItem(response.data);
  };

  let getInvoiceByItem = async () => {
    let response = await AxiosInstance.get(`invoiceByItem/${id}`);
    setInvoiceByItem(response.data);
    setCount(response.data.length);
    setLoading(false);
  };

  useEffect(() => {
    getInvoiceByItem();
    getItem();
  }, []);

  return (
    <div className="container">
      <h3 className="text-center my-2">
        <FaFileInvoice size={30} /> جميع فواتير{" "}
        <span className={theme == "dark" ? "text-green" : "text-navy"}>
          ( {item.name} )
        </span>{" "}
        | {count} فاتورة
      </h3>

      {loading ? (
        <Spinner />
      ) : (
        <div className="d-flex justify-content-center">
          <div className="list-group w-auto">
            {invoiceByItem.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/invoice/preview/${invoice.id}/`}
                className="list-group-item list-group-item-action d-flex justify-content-center gap-3 py-3"
              >
                {invoice.type == `بيع` ? (
                  <FaArrowRight className="text-success" size={20} />
                ) : (
                  <FaArrowLeft size={20} />
                )}
                <div className="text-center">
                  <h6>
                    {invoice.type} | {`EGP ` + invoice.total.toLocaleString()}
                    <br />
                    <span className=" mt-1">
                      {dayjs(invoice.invoice_time).format(`YY/MM/DD`)} |{" "}
                      {invoice.invoice_by}@
                    </span>
                    <br />
                    <span>{invoice.account}</span>
                  </h6>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div>
        <Link
          to={-1}
          className="list-group-item list-group-item-action d-flex gap-3 py-3 justify-content-center"
        >
          عودة ... <FaArrowLeft size={20} />
        </Link>
      </div>
    </div>
  );
};

export default InvoiceByItem;
