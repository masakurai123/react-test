// src/components/ClientList.js
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const querySnapshot = await getDocs(collection(db, "client"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
    };

    fetchClients();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClients = clients.filter((client) => {
    const keyword = searchTerm.trim().toLowerCase();
    return (
      client.顧客コード?.toLowerCase().includes(keyword) ||
      client.氏名?.toLowerCase().includes(keyword) ||
      client.カナ?.toLowerCase().includes(keyword) ||
      client.電話番号?.toLowerCase().includes(keyword) ||
      client.住所?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>顧客検索</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="顧客コード・氏名・カナ・電話番号・住所 で検索"
        style={{
          padding: "8px",
          width: "360px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      {/* {filteredClients.length > 0 ? ( */}
      {searchTerm.trim() !== "" && filteredClients.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>顧客コード</th>
              <th style={thStyle}>氏名</th>
              <th style={thStyle}>カナ</th>
              <th style={thStyle}>電話番号</th>
              <th style={thStyle}>住所</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id}>
                <td style={tdStyle}>{client.顧客コード}</td>
                <td style={tdStyle}>{client.氏名}</td>
                <td style={tdStyle}>{client.カナ}</td>
                <td style={tdStyle}>{client.電話番号}</td>
                <td style={tdStyle}>{client.住所}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : searchTerm.trim() !== "" ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>顧客コード</th>
              <th style={thStyle}>氏名</th>
              <th style={thStyle}>カナ</th>
              <th style={thStyle}>電話番号</th>
              <th style={thStyle}>住所</th>
            </tr>
          </thead>
        </table>
        // <p>検索結果がありません。</p>
      ) : searchTerm.trim() === "" ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>顧客コード</th>
              <th style={thStyle}>氏名</th>
              <th style={thStyle}>カナ</th>
              <th style={thStyle}>電話番号</th>
              <th style={thStyle}>住所</th>
            </tr>
          </thead>
        </table>
      ) : null}
      <p style={{ fontSize:"12px"}}>※ 『山田』と入力で全件表示されます。</p>
      <p style={{ fontSize:"12px"}}>※ 『太郎』などであいまい検索可能。</p>
    </div>
  );
};

const thStyle = {
  borderBottom: "2px solid #ccc",
  padding: "10px",
  backgroundColor: "#f4f4f4",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "10px",
};

export default ClientList;
