import React, {useState} from "react";
import axios from "axios";


const VerifyAdminScreen = () => {
    const [data, setData] = useState({});
    const [error, setError] = useState("");
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        try {
            const url = `http://localhost:8081/verifyAdmin`;
            const {data: res} = await axios.post(url, data);
            setMsg(res.message)
            console.log(data);
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            }
        }
    };

    return (
        <div style={{
            display: "flex",
            height: '100vh',
            backgroundColor: '#F4F4F4',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            alignContent: 'center'
        }}>
            <div style={{
                display: "flex",
                padding:"30px 50px",
                backgroundColor: '#fff',
                borderRadius:'10px',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                alignContent: 'center'
            }}>
                <h4 style={{fontWeight: '700', color: '#000000', marginBottom:'20px'}}>Вход в панель админестратора</h4>
                <p style={{fontSize: '18px', fontWeight: '400', color: '#000000', marginBottom:'20px'}}>Если вы администратор, подтвердите свою
                    электронную почту</p>
                <button style={{
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#06B5AE',
                    color: '#fff',
                    fontWeight: "500",
                    padding: '10px 20px',
                    marginBottom:'20px'
                }} onClick={handleSubmit}>
                    Отправить письмо
                </button>
                <div style={{maxWidth:'70%', textAlign: 'center'}}>
                    {error && <div style={{fontSize: '14px', fontWeight: '500', color: '#cb4d4d'}}>{error}</div>}
                    {msg && <div style={{fontSize: '14px', fontWeight: '500', color: '#4dcb5b'}}>{msg}</div>}
                </div>

            </div>
        </div>
    );

};

export default VerifyAdminScreen;
