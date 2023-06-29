import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import goldStar from "../../img/goldStar.svg";


const Signup = () => {
    const [data, setData] = useState({
        title: "",
        radio: "",
        language: "",
        genre: "",
        image: "image",
        bitrate: 0,
        online: 0,
        rating: [],
    });
    const [error, setError] = useState("");
    const [msg,setMsg] = useState('');
    const [radios, setRadios] = useState([]);

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };


    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getAllUsers`);
            setRadios(response.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {

        fetchUsers();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        try {
            const url = `http://localhost:8081/createRadio`;
            const { data: res } = await axios.post(url, data);
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
    const servDelete = async (ServId) => {
        try{
            const {data} = await axios.delete(`http://localhost:8081/post-delete/${ServId}`);
            console.log(data)
        }catch (err){
            console.log(err)
        }
    }
    return (
        <div className={styles.signup_container} style={{height: radios.length > 0 ? '100%' : '100vh'}}>
            <form className={styles.form_container} onSubmit={handleSubmit} noValidate>
                <Link style={{textDecoration: "none", color: "#454545", fontSize: "14px",margin:"20px 0 10px 20px"}} to="/">˂ Перейти на главную</Link>
                <h3 style={{margin:"0 0 0 20px"}}>Страница Администратора</h3>
                <div style={{justifyContent:"center",maxWidth:'500px',borderRadius:8, margin:"10px 10px", padding:"20px 10px"}}>
                    <h5 style={{margin:"0 0 5px 0"}}>Название</h5>
                    <div style={{position: 'relative', display:'flex', alignItems:'center'}}>
                        <input
                            type="text"
                            placeholder="русское радио"
                            name="title"
                            onChange={handleChange}
                            value={data.title}
                            required
                            className={styles.input}
                        />
                    </div>

                    <h5 style={{margin:"10px 0 5px 0"}}>Язык</h5>
                    <div style={{position: 'relative', display:'flex', alignItems:'center'}}>
                        <input
                            type="text"
                            placeholder="Русский"
                            name="language"
                            onChange={handleChange}
                            value={data.language}
                            required
                            className={styles.input}
                        />
                    </div>

                    <h5 style={{margin:"10px 0 5px 0"}}>Жанр</h5>
                    <div style={{position: 'relative', display:'flex', alignItems:'center'}}>
                        <input
                            type="text"
                            placeholder="Джаз"
                            name="genre"
                            onChange={handleChange}
                            value={data.genre}
                            required
                            className={styles.input}
                        />
                    </div>
                    <h5 style={{margin:"10px 0 5px 0"}}>Ссылка на радио поток</h5>
                    <div style={{position: 'relative', display:'flex', alignItems:'center'}}>
                        <input
                            type="text"
                            placeholder="https://www..."
                            name="radio"
                            onChange={handleChange}
                            value={data.radio}
                            required
                            className={styles.input}
                        />
                    </div>

                </div>

                <button type="submit" className={styles.submit_btn}>
                    Создать
                </button>
            </form>
            <div>
                {error && <div className={styles.error_msg}>{error}</div>}
                {msg && <div className={styles.success_msg}>{msg}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom:'50px', alignSelf:'center' }}>
                {radios.map((radio) => (
                    <div className={'oneBestSpecialistsBlock'} key={radio.id}>
                        <Link style={{ textDecoration: "none", color: "#000", flexDirection: 'column', height:'100%', width:'100%' }} >
                            <div style={{ display: 'flex', flexDirection: 'column', alignContent:'space-between' }}>
                                <div style={{ position: 'relative', display: 'flex', flexDirection: 'row' }}>
                                    {radio.rating && radio.rating.length > 0 && radio.rating[0] !== '' && (
                                        <div style={{ position: 'absolute', top: 4, right: 4, backgroundColor: '#ffffff', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
                                            <img style={{ width: '12px' }} src={goldStar} alt="star" />
                                            <p style={{ margin: '0 0 2px 0', fontSize: '13px' }}>
                                                {(radio.rating.reduce((acc, rating) => acc + rating.value, 0) / radio.rating.length).toFixed(1)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignContent: 'space-around' }}>
                                    <p style={{ fontWeight: '500', margin: '5px 0 0 0' }}>
                                        {radio.title}
                                    </p>
                                    <p style={{ fontWeight: '500', margin: '5px 0 0 0' }}>
                                        {radio.language}
                                    </p>
                                    <p style={{ fontWeight: '500', margin: '5px 0 0 0' }}>
                                        {radio.genre}
                                    </p>
                                    <p style={{ fontWeight: '500', margin: '5px 0 0 0' }} onClick={() => servDelete(radio._id)}>
                                        Delete
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default Signup;
