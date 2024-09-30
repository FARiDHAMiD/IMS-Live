import { useEffect, useState } from "react";
import AxiosInstance from "../../Components/AxiosInstance";
import Spinner from "../../Components/Spinner";
import SearchBox from "../../Components/SearchBox";
import UseDebounce from "../../hooks/UseDebounce";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const InvoiceArchive = () => {
  let [loading, setLoading] = useState(true);
  let [input, setInput] = useState([]);
  const debounce = UseDebounce(input, 800);
  let [invoices, setInvoices] = useState([]);
  let navigate = useNavigate();

  let getInvoices = async () => {
    let response = await AxiosInstance.get(`invoice/?invoice_no=${input}`);
    setInvoices(response.data);
    setLoading(false);
  };

  let editInvoice = (id) => {
    navigate(`/control/editInvoice/${id}`);
  };

  useEffect(() => {
    getInvoices();
  }, [debounce]);

  return (
    <>
      <div className="row">
        <div className="col-md-8 col-7 d-flex justify-content-right">
          <SearchBox searchTxt={input} setSearchTxt={setInput} width={12} />
        </div>
        <div className="col-md-4 col-5 mt-2 d-flex justify-content-center">
          بحث برقم الفاتورة
        </div>
      </div>
      <h4 className="text-center mb-2 text-green">إختر فاتورة للتعديل</h4>
      {loading ? (
        <Spinner />
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th className="text-warning">#</th>
              <th className="text-warning">رقم الفاتورة</th>
              <th className="text-warning">نوع الفاتورة</th>
              <th className="text-warning">توقيت</th>
              <th className="text-warning">المستخدم</th>
              <th className="text-warning">لحساب</th>
              <th className="text-warning">الإجمالى</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id} onClick={() => editInvoice(invoice.id)}>
                <td>{index + 1}</td>
                <td>{invoice.invoice_no}</td>
                <td>{invoice.type}</td>
                <td>{dayjs(invoice.invoice_time).format("YY/MM/DD h:mma")}</td>
                <td>{invoice.invoice_by}</td>
                <td className="text-nowrap">{invoice.account}</td>
                <td>{invoice.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default InvoiceArchive;
