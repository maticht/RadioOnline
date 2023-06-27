import React, { useState } from "react";
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import styles from "./styles.module.css";

const UpdateDescription = () => {
    const {UserPage} = useParams();
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        password: "",
        nameOrCompany: "",
        areasActivity: "",
        phone1: "",
        phone2: "",
        image: [],
        Facebook: "",
        TikTok: "",
        YouTube: "",
        Instagram: "",
        WhatsApp: "",
        Telegram: "",
        Viber: "",
        LinkedIn: "",
        city: "",
        region: "",
        street: "",
        house: "",
        apartment: "",
        zip: "",
        workLocation: '',
        description: "",
        services: "",
        price: "",
        savedUsers: [],
        likes: "",
        rating: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = ({ currentTarget: input }) => {
        const { name, value } = input;

        if (value.length <= 900) {
            setData({ ...data, [name]: value });
        } else {
            setData({ ...data, [name]: value.slice(0, 900) });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data)
        try {
            const url = `http://backend.delkind.pl/update/${UserPage}`;
            const { data: res } = await axios.put(url, data);
            localStorage.setItem("token",  JSON.stringify(res));
            navigate("/EditProfile");
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
        <div className={styles.signup_container}>
            <Link style={{textDecoration: "none", color: "#454545", fontSize: "14px"}} to="/EditProfile">
                <p style={{textDecoration: "none", color: "#454545", fontSize: "14px", marginLeft:'10px'}}>
                    {`< Назад`}
                </p>
            </Link>
            <form className={styles.form_container} onSubmit={handleSubmit} noValidate>
                <div style={{justifyContent:"space-between", flexDirection:'row', display:'flex',alignItems:'center',}}>
                    <h1 style={{margin:"0 0 10px 10px"}}>Описание</h1>
                    <p style={{ margin: "0 10px 0 0", fontSize:'12px' }}>{data.description.length}/900</p>
                </div>
                <div style={{justifyContent:"flex-start", backgroundColor:"#fff",borderRadius:8, margin:"10px 10px", padding:"15px 10px 12px 10px"}}>
                    <div>
                        <textarea
                            placeholder="Напишите описание"
                            name="description"
                            onChange={handleChange}
                            value={data.description}
                            required
                            className={`${styles.input} ${styles["input-top"]}`}
                        />
                    </div>
                </div>
                {error && <div className={styles.error_msg}>{error}</div>}
                <button type="submit" className={styles.green_btn}>
                    Изменить
                </button>
            </form>
        </div>
    );
};

export default UpdateDescription;
