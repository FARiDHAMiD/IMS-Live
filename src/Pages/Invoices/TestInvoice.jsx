import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import Select from "react-select";
import AxiosInstance from "../../Components/AxiosInstance";
import AuthContext from "../../context/AuthContext";

const TestInvoice = () => {
  const [total, setTotal] = useState("0.00");
  const [subTotal, setSubTotal] = useState("0.00");
  const [taxRate, setTaxRate] = useState("");
  const [taxAmount, setTaxAmount] = useState("0.00");
  const [discountRate, setDiscountRate] = useState("");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  // invoice items array
  const [items, setItems] = useState([
    {
      id: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
      name: "",
      description: "",
      price: 1,
      quantity: 1,
      itemSubTotal: "",
    },
  ]);

  const handleCalculateTotal = useCallback(() => {
    let newSubTotal = items
      .reduce((acc, item) => {
        item.itemSubTotal = parseFloat(item.price) * parseInt(item.quantity);
        // console.log(acc);
        return acc + parseFloat(item.price) * parseInt(item.quantity);
      }, 0)
      .toFixed(2);

    let newtaxAmount = (newSubTotal * (taxRate / 100)).toFixed(2);
    let newdiscountAmount = (newSubTotal * (discountRate / 100)).toFixed(2);
    let newTotal = (
      newSubTotal -
      newdiscountAmount +
      parseFloat(newtaxAmount)
    ).toFixed(2);

    setSubTotal(newSubTotal);
    setTaxAmount(newtaxAmount);
    setDiscountAmount(newdiscountAmount);
    setTotal(newTotal);
    console.log(items);
  }, [items, taxRate, discountRate]);

  useEffect(() => {
    handleCalculateTotal();
  }, [handleCalculateTotal]);

  const handleRowDel = (i) => {
    const deleteVal = [...items];
    deleteVal.splice(i, 1);
    setItems(deleteVal);

    // const updatedItems = items.filter((i) => i.id !== item.id);
    // setItems(updatedItems);
  };

  // add new row
  const handleAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id,
      name: "",
      price: "1.00",
      description: "",
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const onItemizedItemEdit = (evt) => {
    const { id, name, value } = evt.target;

    // console.log(id, name, value);
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setItems(updatedItems);
  };

  const handleChange = (setter) => (event) => {
    setter(event.target.value);
    handleCalculateTotal();
  };

  return (
    <>
      <div className="container d-flex justify-content-center mt-2">
        <div className="col-md-12 mt-2">
          <div className="modal-dialog" role="document">
            <div className="modal-content rounded-4 shadow">
              <div className="container-fluid row mb-2">
                <div className="p-3 pb-4 border-bottom-0 text-center">
                  <h3 className="fw-bold mb-0 fs-2 text-warning ">
                    Test Generate Invoice
                  </h3>
                </div>
                <button
                  className="btn btn-outline-light col-2"
                  onClick={handleAddEvent}
                >
                  Add Item +
                </button>
                {/* invoice items table */}
                <table>
                  <thead>
                    <tr>
                      <th>ITEM</th>
                      <th>QTY</th>
                      <th>PRICE/RATE</th>
                      <th className="text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ minWidth: "30%" }}>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder="Item name"
                            defaultValue={item.name}
                            id={item.id}
                            onChange={onItemizedItemEdit}
                          />
                        </td>
                        <td style={{ minWidth: "20%" }}>
                          <input
                            type="number"
                            className="form-control"
                            name="quantity"
                            placeholder="quantity"
                            defaultValue={item.quantity}
                            id={item.id}
                            onChange={onItemizedItemEdit}
                          />
                        </td>
                        <td style={{ minWidth: "20%" }}>
                          <input
                            type="number"
                            className="form-control"
                            name="price"
                            min={1}
                            step="0.01"
                            presicion={2}
                            defaultValue={item.price}
                            id={item.id}
                            onChange={onItemizedItemEdit}
                          />
                        </td>
                        <td style={{ minWidth: "20%" }}>
                          <input
                            type="number"
                            className="form-control"
                            name="itemSubTotal"
                            defaultValue={item.itemSubTotal}
                            id={item.id}
                            disabled
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-danger"
                            style={{ float: "left" }}
                            onClick={handleRowDel}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Invoice Total */}
            <hr />
            <div className="col-6 text-warning m-1">
              <div className="d-flex flex-row align-items-start justify-content-between">
                <span className="fw-bold">قيمة الأصناف:</span>
                <span>EGP {subTotal}</span>
              </div>
              <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                <span className="fw-bold">الخصم:</span>
                <span>
                  <span className="small ">({discountRate || 0}%)</span>
                  {discountAmount || 0}
                </span>
              </div>
              <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                <span className="fw-bold">ضريبة:</span>
                <span>
                  <span className="small ">({taxRate || 0}%)</span>
                  {taxAmount || 0}
                </span>
              </div>
              <hr />
              <div
                className="d-flex flex-row align-items-start justify-content-between"
                style={{ fontSize: "1.125rem" }}
              >
                <span className="fw-bold">إجمالى الفاتورة:</span>
                <span className="fw-bold">{total || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestInvoice;
