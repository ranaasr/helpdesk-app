/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "./styles/Sidebar.css";

const Sidebar = ({ onLogout, unreadCount }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalNonaktif, setTotalNonaktif] = useState(0);
  const [hasUpdated, setHasUpdated] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    onLogout();
    setTimeout(() => {
      navigate("/admin/logout");
    }, 500);
  };

  useEffect(() => {
    const unsubscribePengajuan = onSnapshot(
      collection(db, "pengajuan"),
      (snapshot) => {
        const unreadCount = snapshot.docs.filter(
          (doc) => !doc.data().isRead
        ).length;
        setTotalUnread(unreadCount);
      }
    );

    const unsubscribeAdmin = onSnapshot(collection(db, "admin"), (snapshot) => {
      const nonaktifCount = snapshot.docs.filter(
        (doc) => doc.data().status === "nonaktif"
      ).length;
      setTotalNonaktif(nonaktifCount);
    });

    return () => {
      unsubscribePengajuan();
      unsubscribeAdmin();
    };
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      setHasUpdated(true);
    }
  }, [unreadCount]);

  const getMenuItemClass = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {props.title}
    </Tooltip>
  );

  return (
    <div
      className={`sidebar ${
        isCollapsed
          ? "collapsed d-flex justify-content-start"
          : "d-flex justify-content-end"
      }`}
    >
      <button
        className="toggle-btn d-flex justify-content-start"
        onClick={toggleSidebar}
      >
        <span className="material-symbols-outlined">
          {isCollapsed ? "menu" : "close"}
        </span>
      </button>
      <div className="menu">
        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Aturan</Tooltip>}
          >
            <Link
              to="/admin/dashboard"
              className={getMenuItemClass("/admin/dashboard")}
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="menu-text">Aturan</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/dashboard"
            className={getMenuItemClass("/admin/dashboard")}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="menu-text">Aturan</span>
          </Link>
        )}

        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Fakta Permasalahan</Tooltip>}
          >
            <Link
              to="/admin/fakta-permasalahan"
              className={getMenuItemClass("/admin/fakta-permasalahan")}
            >
              <span className="material-symbols-outlined">report_problem</span>
              <span className="menu-text">Fakta Permasalahan</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/fakta-permasalahan"
            className={getMenuItemClass("/admin/fakta-permasalahan")}
          >
            <span className="material-symbols-outlined">report_problem</span>
            <span className="menu-text">Fakta Permasalalahan</span>
          </Link>
        )}

        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Kesimpulan</Tooltip>}
          >
            <Link
              to="/admin/kesimpulan"
              className={getMenuItemClass("/admin/kesimpulan")}
            >
              <span className="material-symbols-outlined">assessment</span>
              <span className="menu-text">Kesimpulan</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/kesimpulan"
            className={getMenuItemClass("/admin/kesimpulan")}
          >
            <span className="material-symbols-outlined">assessment</span>
            <span className="menu-text">Kesimpulan</span>
          </Link>
        )}

        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Solusi</Tooltip>}
          >
            <Link
              to="/admin/solusi"
              className={getMenuItemClass("/admin/solusi")}
            >
              <span className="material-symbols-outlined">lightbulb</span>
              <span className="menu-text">Solusi</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/solusi"
            className={getMenuItemClass("/admin/solusi")}
          >
            <span className="material-symbols-outlined">lightbulb</span>
            <span className="menu-text">Solusi</span>
          </Link>
        )}

        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Manajemen Admin</Tooltip>}
          >
            <Link
              to="/admin/manajemen-user"
              className={getMenuItemClass("/admin/manajemen-user")}
            >
              <span className="material-symbols-outlined">
                supervisor_account
              </span>
              <span className="menu-text">Manajemen Admin</span>
              {totalNonaktif > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                  {totalNonaktif}
                  <span className="visually-hidden">nonaktif accounts</span>
                </span>
              )}
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/manajemen-user"
            className={getMenuItemClass("/admin/manajemen-user")}
          >
            <span className="material-symbols-outlined">
              supervisor_account
            </span>
            <span className="menu-text">Manajemen Admin</span>
            {totalNonaktif > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                {totalNonaktif}
                <span className="visually-hidden">nonaktif accounts</span>
              </span>
            )}
          </Link>
        )}

        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Manajemen Mhsw</Tooltip>}
          >
            <Link
              to="/admin/manajemen-mhsw"
              className={getMenuItemClass("/admin/manajemen-mhsw")}
            >
              <span className="material-symbols-outlined">school</span>
              <span className="menu-text">Manajemen Mhsw</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/manajemen-mhsw"
            className={getMenuItemClass("/admin/manajemen-mhsw")}
          >
            <span className="material-symbols-outlined">school</span>
            <span className="menu-text">Manajemen Mhsw</span>
          </Link>
        )}
      </div>
      <div className="menu notification">
        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Notifikasi</Tooltip>}
          >
            <Link
              to="/admin/notifikasi"
              className={`menu-item position-relative ${getMenuItemClass(
                "/admin/notifikasi"
              )}`}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="menu-text">Notifikasi</span>
              {totalUnread > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {totalUnread}
                  <span className="visually-hidden">unread messages</span>
                </span>
              )}
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            to="/admin/notifikasi"
            className={`menu-item position-relative ${getMenuItemClass(
              "/admin/notifikasi"
            )}`}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="menu-text">Notifikasi</span>
            {totalUnread > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalUnread}
                <span className="visually-hidden">unread messages</span>
              </span>
            )}
          </Link>
        )}
        {isCollapsed ? (
          <OverlayTrigger
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={<Tooltip>Logout</Tooltip>}
          >
            <Link
              onClick={handleLogout}
              className={`menu-item position-relative logout ${getMenuItemClass(
                "/admin/logout"
              )}`}
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="menu-text">Logout</span>
            </Link>
          </OverlayTrigger>
        ) : (
          <Link
            onClick={handleLogout}
            className={`menu-item position-relative logout ${getMenuItemClass(
              "/admin/logout"
            )}`}
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="menu-text">Logout</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
