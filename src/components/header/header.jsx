import React, { useContext, useEffect, useState } from "react";
import "./header.css";
import { auth, db } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { redirect, Link, useNavigate } from "react-router-dom";
import { authContext } from "../../firebase/firebaseContext";
import { uploaderUser } from "../../firebase/uploaderuser";

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(authContext);
  const [searchUser, setSearchUser] = useState("");
  const [findUser, setFindUser] = useState(null);
  const [err, setErr] = useState(false);
  const { uploadUser, setUploadUser } = useContext(uploaderUser);
  // console.log(user);

  const handleSignout = () => {
    if (confirm("Do you want to logout?")) {
      signOut(auth).then(() => {
        navigate("/login");
      });
    }
  };
  const handleSearch = async () => {
    if (searchUser.length > 0) {
      document.getElementById('showUser').style.display = 'block';
      const q = query(collection(db, "users"), where("Name", "==", searchUser));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          setFindUser(doc.data());
        });
        console.log(findUser?findUser:'');
        setErr(false);
      } else {
        setErr(true);
        console.log("No user Found");
        setFindUser(null);
      }
    }else{
      document.getElementById('showUser').style.display = 'none';
    }
  };
  const handleUser = (id) => {
    setUploadUser(id);
    setSearchUser("");
    setFindUser(null)
    navigate("/user");
  };

  return (
    <div className="fixed">
      <div className="nav">
        <div className="sadf45">
          <div className="intro">
            <Link to="/" style={{ color: "black" }}>
              {" "}
              <h3>Socio</h3>
            </Link>
          </div>
          <div className="searchuser">
            <input
              type="text"
              value={searchUser}
              onKeyUp={handleSearch}
              onChange={(e) => {
                setSearchUser(e.target.value);
              }}
              className="searchuserinput"
              placeholder="Search user. . ."
              name=""
              id="searchuserinput"
            />
            <div className="searchimg">
              <img className="searchuserimg" src="search.png" alt="" />
            </div>
            <div className="showUser" id="showUser">
              {err && (
                <div className="usererror">
                  <span>User Not Found!</span>
                </div>
              )}

              {findUser && (
                <div>
                  <div
                    className="users"
                    onClick={() => {
                      handleUser(findUser.userId);
                    }}
                  >
                    <div className="profileImg">
                      <img src={findUser.profileUrl} alt="" />
                    </div>
                    <div className="userName">
                      <p>{findUser.Name}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <ol>
          {user && <li><Link to="/profile">{user.displayName}</Link></li>}
          <li>
            {user ? (
              <Link onClick={handleSignout}>Logout</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </li>
        </ol>
      </div>
    </div>
  );
}

export default Header;
