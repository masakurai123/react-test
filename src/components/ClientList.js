// src/components/ClientList.js
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
// import { AuthErrorCodes } from "firebase/auth";

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState(null); // 選択されたクライアント
  const [originalClient, setOriginalClient] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

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

  const handleRowClick = (client) => {
    setSelectedClient({ ...client });       // オブジェクトをコピーして保存
    setOriginalClient({ ...client });       // こちらもコピー
  };

  // const handleNameChange = (e) => {
  //   setSelectedClient({ ...selectedClient, 氏名: e.target.value });
  // };

  const handleUpdate = async () => {
    if (!selectedClient || !originalClient) return;

    const updatedFields = {};
    ["氏名", "カナ", "電話番号", "住所"].forEach((field) => {
      if (selectedClient[field] !== originalClient[field]) {
        updatedFields[field] = selectedClient[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      setUpdateMessage("変更はありません");
      setTimeout(() => setUpdateMessage(""), 3000);
      return;
    }

    try {
      const docRef = doc(db, "client", selectedClient.id);
      await updateDoc(docRef, updatedFields);

      const querySnapshot = await getDocs(collection(db, "client"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClients(data);
      setOriginalClient({ ...selectedClient });

      setUpdateMessage("更新しました");
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (error) {
      console.error("更新失敗:", error);
      setUpdateMessage("更新に失敗しました");
      setTimeout(() => setUpdateMessage(""), 3000);
    }
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

      {selectedClient && (
        <div style={{ marginBottom: "20px" }}>
          <h3>選択された顧客情報</h3>
          <label style={labelStyle}>氏名</label>
          <input
            type="text"
            value={selectedClient.氏名 || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, 氏名: e.target.value })
            }
            style={inputStyle}
          />
          <br />
          <label style={labelStyle}>カナ</label>
          <input
            type="text"
            value={selectedClient.カナ || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, カナ: e.target.value })
            }
            style={inputStyle}
          />
          <br />
          <label style={labelStyle}>電話番号</label>
          <input
            type="text"
            value={selectedClient.電話番号 || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, 電話番号: e.target.value })
            }
            style={inputStyle}
          />
          <br />
          <label style={labelStyle}>住所</label>
          <input
            type="text"
            value={selectedClient.住所 || ""}
            onChange={(e) =>
              setSelectedClient({ ...selectedClient, 住所: e.target.value })
            }
            style={inputStyle}
          />
          <br />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={handleUpdate} style={buttonStyle}>
              顧客情報を更新
            </button>

            {updateMessage && (
              <p style={{ ...messageStyle, opacity: updateMessage ? 1 : 0 }}>
                {updateMessage}
              </p>
            )}
          </div>
        </div>
      )}

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
              // <tr key={client.id}>
              <tr key={client.id} onClick={() => handleRowClick(client)}>
                <td style={tdStyle}>{client.顧客コード}</td>
                <td style={tdStyle}>{client.氏名}</td>
                <td style={tdStyle}>{client.カナ}</td>
                <td style={tdStyle}>{client.電話番号}</td>
                <td style={tdStyle}>{client.住所}</td>
              </tr>
            ))}
          </tbody>
        </table>
        // ) : searchTerm.trim() !== "" ? (
        //   <></>
        // <p>検索結果がありません。</p>
        // ) : searchTerm.trim() === "" ? (
        //   <></>
      ) : null}
      <p style={{ fontSize: "12px" }}>※ 『山田』と入力で全件表示されます。</p>
      <p style={{ fontSize: "12px" }}>※ 『太郎』などであいまい検索可能。</p>
    </div>
  );
};

const thStyle = {
  // borderBottom: "2px solid #ccc",
  border: "2px solid #ccc",
  padding: "8px",
  backgroundColor: "#f4f4f4",
};

const tdStyle = {
  border: "1px solid #eee",
  padding: "8px",
};

const labelStyle = {
  border: "2px solid #ccc",
  padding: "8.5px 48px",
  fontSize: "16px",
  backgroundColor: "#f4f4f4",
};

const inputStyle = {
  padding: "8px",
  marginBottom: "10px",
  width: "300px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  marginTop: "10px",
};

const messageStyle = {
  transition: "opacity 3s ease",
  color: "green",
  fontSize: "14px",
  margin: 0,
};

export default ClientList;