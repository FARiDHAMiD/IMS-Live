import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import MainLayout from "./Pages/Layouts/MainLayout";
import WelcomePage from "./Pages/WelcomePage";
import PrivateRoute from "./utils/PrivateRoute";
import AdminPrivateRoute from "./utils/AdminPrivateRoute";
import ReportsPage from "./Pages/Reports/ReportsPage";
import PageNotFound from "./Pages/StatusCodes/PageNotFound";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterUserPage from "./Pages/Auth/RegisterUserPage";
import ControlPage from "./Pages/Control/ControlPage";
import DefaultCreateForm from "./Components/Forms/DefaultCreateForm";
import DefaultEditForm from "./Components/Forms/DefaultEditForm";
import BasicDataControl from "./Pages/Control/BasicDataControl";
import ChangedDataControl from "./Pages/Control/ChangedDataControl";
import Accounts from "./Pages/Accounts/Accounts";
import Users from "./Pages/Users/Users";
import Stocks from "./Pages/Stocks/Stocks";
import CreateStock from "./Pages/Stocks/CreateStock";
import Items from "./Pages/Items/Items";
import Credit from "./Pages/Credit/Credit";
import ControlDataLayout from "./Pages/Layouts/ControlDataLayout";
import EditAccount from "./Pages/Accounts/EditAccount";
import CreateAccount from "./Pages/Accounts/CreateAccount";
import Archive from "./Pages/Archive/Archive";
import AccountsArchive from "./Pages/Archive/AccountsArchive";
import Profile from "./Pages/Users/Profile";
import EditProfile from "./Pages/Users/EditProfile";
import EditStock from "./Pages/Stocks/EditStock";
import StocksArchive from "./Pages/Archive/StockArchive";
import EditUser from "./Pages/Users/EditUser";
import CreateUser from "./Pages/Users/CreateUser";
import StaffPrivateRoute from "./utils/StaffPrivateRoute";
import PricingPage from "./Pages/PricingPage";
import CreateItem from "./Pages/Items/CreateItem";
import EditItem from "./Pages/Items/EditItem";
import ItemsLog from "./Components/Logs/ItemsLog";
import AccountsReports from "./Pages/Reports/AccountsReports";
import StocksReports from "./Pages/Reports/StocksReports";
import ItemsReports from "./Pages/Reports/ItemsReports";
import Invoices from "./Pages/Invoices/Invoices";
import InvoiceRequest from "./Pages/Invoices/InvoiceRequest";
import InvoiceCard from "./Pages/Invoices/InvoiceCard";
import BillInvoice from "./Pages/Invoices/BillInvoice";
import TestInvoice from "./Pages/Invoices/TestInvoice";
import UserInvoices from "./Pages/Users/UserInvoices";
import InvoicesReports from "./Pages/Reports/InvoicesReports";
import PurchaseInvoice from "./Pages/Invoices/PurchaseInvoice";
import WorkingOnIt from "./Pages/StatusCodes/WorkingOnIt";
import InvoiceArchive from "./Pages/Archive/InvoiceArchive";
import EditInvoice from "./Pages/Archive/EditInvoice";
import CashInvoice from "./Pages/Invoices/CashOutInvoice";
import CashOutInvoice from "./Pages/Invoices/CashOutInvoice";
import CashInInvoice from "./Pages/Invoices/CashInInvoice";
import InvoicePreview from "./Pages/Invoices/InvoicePreview";
import SystemInfo from "./Pages/SystemInfo";
import Treasury from "./Pages/Treasury/Treasury";
import CashCollectRequestDetails from "./Pages/Treasury/CashCollectRequestDetails";
import CashCollectRequestUser from "./Pages/Treasury/CashCollectRequestUser";
import ExpensesInvoice from "./Pages/Invoices/ExpensesInvoice";

const App = () => {
  const controlData = [
    { url: "itemUnit", label: "وحدات القياس" },
    { url: "itemCat", label: "فئات الأصناف" },
    { url: "itemType", label: "أنواع الأصناف" },
    { url: "payType", label: "طرق السداد" },
    { url: "accountType", label: "أنواع الحسابات" },
    { url: "invoiceType", label: "أنواع الفواتير" },
    { url: "company", label: "بيانات الشركات" },
  ];
  return (
    <BrowserRouter>
      <AuthProvider>
        <Fragment>
          <Routes>
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<WelcomePage />} />
              <Route path="/systeminfo" element={<SystemInfo />} />

              {/* // private routes - must be logged in */}
              <Route element={<PrivateRoute />}>
                {/* Superadmin Admin Routers - logged in as superuser */}

                <Route
                  path="/cash-collect-user/:id"
                  element={<CashCollectRequestUser />}
                />

                <Route element={<AdminPrivateRoute />}>
                  {/* Treasury Control - الخزينة */}
                  <Route path="/control/treausry" element={<Treasury />} />
                  <Route
                    path="/control/cash-collect/:id"
                    element={<CashCollectRequestDetails />}
                  />

                  <Route
                    path="/control/cash-collect-user/:id"
                    element={<CashCollectRequestUser />}
                  />

                  {/* Users and Profile  */}
                  <Route path="/control/user" element={<Users />} />
                  <Route path="/control/user/create" element={<CreateUser />} />
                  <Route path="/control/user/:id" element={<EditUser />} />
                  <Route path="/control" element={<ControlPage />} />
                  {/* Handle basic data control  */}
                  <Route
                    path="/control/basicControl"
                    element={<BasicDataControl />}
                  />
                  {/* basic data control list  */}
                  {controlData.map((data) => (
                    <Route
                      key={data.url}
                      path={`/control/${data.url}`}
                      element={
                        <BasicDataControl
                          control={data.url}
                          label={data.label}
                        />
                      }
                    />
                  ))}
                  {/*  basic data Edit / update page */}
                  {controlData.map((data) => (
                    <Route
                      key={data.url}
                      path={`/control/${data.url}/:id`}
                      element={
                        <DefaultEditForm
                          control={data.url}
                          label={data.label}
                        />
                      }
                    />
                  ))}
                  {/* handle changed data control  - stocks, accounts, items, etc... */}
                  <Route path="/" element={<ControlDataLayout />}>
                    <Route
                      path="/control/changedControl"
                      element={<ChangedDataControl />}
                    />

                    {/* *************** Accounts - الحسابات  **************** */}
                    <Route path="/control/account" element={<Accounts />} />
                    <Route
                      path="/control/account/create"
                      element={<CreateAccount />}
                    />
                    <Route
                      path="/control/account/:id"
                      element={<EditAccount />}
                    />

                    {/* *************** Stocks - المخازن  **************** */}
                    <Route path="/control/stock" element={<Stocks />} />
                    <Route
                      path="/control/stock/create"
                      element={<CreateStock />}
                    />
                    <Route path="/control/stock/:id" element={<EditStock />} />

                    {/* *************** Items - الأصناف  **************** */}
                    <Route path="/control/item" element={<Items />} />
                    <Route
                      path="/control/item/create"
                      element={<CreateItem />}
                    />
                    <Route path="/control/item/:id" element={<EditItem />} />

                    <Route path="/control/credit" element={<Credit />} />
                  </Route>
                  {/* basic data default  create form  */}
                  <Route
                    path="/control/defaultCreate"
                    element={<DefaultCreateForm />}
                  />
                  {/* *********************  Archive Routes  **************** */}
                  <Route path="/control/archive" element={<Archive />} />
                  <Route
                    path="/control/invoiceArchive"
                    element={<InvoiceArchive />}
                  />
                  <Route
                    path="/control/editInvoice/:id"
                    element={<EditInvoice />}
                  />
                  <Route
                    path="/control/accountArchive"
                    element={<AccountsArchive />}
                  />
                  <Route
                    path="/control/stockArchive"
                    element={<StocksArchive />}
                  />
                </Route>

                {/* staff users Routers - logged in as staff */}
                <Route element={<StaffPrivateRoute />}>
                  <Route path="/stocks" element={<Stocks />} />
                  <Route path="/items" element={<Items />} />
                  <Route path="/accounts" element={<Accounts />} />

                  {/* ********* Reports ***************  */}
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route
                    path="/reports/accounts"
                    element={<AccountsReports />}
                  />
                  <Route path="/reports/stocks" element={<StocksReports />} />
                  <Route path="/reports/items" element={<ItemsReports />} />
                  <Route
                    path="/reports/invoices"
                    element={<InvoicesReports />}
                  />

                  {/* Entery / Update Log  */}
                  <Route path="/itemsLog" element={<ItemsLog />} />
                  {/*  all invoice not allowed to regular user  */}
                  <Route path="/invoice/invoices" element={<Invoices />} />
                </Route>
                {/* End Staff routes  */}

                {/* ******************** Invoces ********************  */}
                <Route path="/invoice" element={<InvoiceRequest />} />

                <Route
                  path="/invoice/preview/:id"
                  element={<InvoicePreview />}
                />

                <Route path="/invoice/bill" element={<BillInvoice />} />
                <Route path="/invoice/purchase" element={<PurchaseInvoice />} />
                <Route path="/invoice/cashOut" element={<CashOutInvoice />} />
                <Route path="/invoice/cashIn" element={<CashInInvoice />} />
                <Route path="/invoice/expenses" element={<ExpensesInvoice />} />
                <Route path="/invoice/test" element={<TestInvoice />} />

                <Route path="/userInvoices/:id" element={<UserInvoices />} />

                <Route path="/profile/:id/edit" element={<EditProfile />} />
                <Route path="/profile/:id" element={<Profile />} />
              </Route>

              <Route path="/working" element={<WorkingOnIt />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterUserPage />} />
          </Routes>
        </Fragment>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
