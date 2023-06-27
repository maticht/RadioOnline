import React, {useEffect, useState} from "react";
import HeaderNavBar from '../../components/headerNavBar/headerNavBar';
import { createUseStyles } from "react-jss";
import {Link} from "react-router-dom";
import axios from "axios";
import goldStar from "../../img/goldStar.svg";
import './HomeScreen.css';
import Star from "../../img/Star1.svg";
import styles from "../../components/UpdateDescription/styles.module.css";

const useStyles = createUseStyles({
    container: {
        minHeight: "100vh",
        backgroundColor: "#F1F1F1"
    },
});
function HomeScreen() {
    const classes = useStyles();
    const [radios, setRadios] = useState([]);
    const [selectedRadio, setSelectedRadio] = useState(null);

    const playRadio = (radio) => {
        setSelectedRadio(radio);
    };
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getAllUsers`);
            setRadios(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleRate = async (userid, rating, description, name) => {
        try {
            const url = `http://localhost:8081/addingRating/${userid}`;
            const { data: res } = await axios.put(url, { value: rating, description: description, name: name });
            fetchUsers();
        } catch (error) {
            console.log(error);
        }
    };
    const [rating, setRating] = useState(0);
    const [ratingDesc, setRatingDesc] = useState({
        description: ""
    });
    const [ratingName, setRatingName] = useState({
        name: ""
    });
    const handleChange = ({ currentTarget: input }) => {
        const { name, value } = input;

        if (value.length <= 2000) {
            setRatingDesc({ ...ratingDesc, [name]: value });
        } else {
            setRatingDesc({ ...ratingDesc, [name]: value.slice(0, 2000) });
        }
    };
    const handleChangeName = ({ currentTarget: input }) => {
        const { name, value } = input;
            setRatingName({ ...ratingName, [name]: value });
    };

    const handleAddRating = () => {
        toggleRate(selectedRadio._id, rating, ratingDesc.description, ratingName.name)
            .then(() => {
                setRating(0);
                setRatingDesc({ description: "" });
                setRatingName({ name: "" });
            })
            .catch(error => {
                console.log(error);
            });
    };
    const handleRate = (value) => {
        setRating(value);
    };

    useEffect(() => {

        fetchUsers();
    }, []);

    return (
        <>
            <div className={classes.container}>
                <HeaderNavBar />

                <div className={'bestSpecialists'}>
                    {selectedRadio && (
                        <div className="largeRadioBlock">
                            <audio src={selectedRadio.radio} autoPlay controls ></audio>
                        </div>
                    )}
                    <h2 style={{margin:'20px 0 10px 10px'}}>{`Похожие странции`}</h2>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                        {radios.map((radio) => (
                            <div className={'oneBestSpecialistsBlock'} key={radio.id} onClick={() => playRadio(radio)}>
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
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    {selectedRadio && (
                        <div className="largeRadioBlock">
                            <h2 style={{margin:'20px 0 10px 10px'}}>{`Отзывы`}</h2>
                            <div style={{ position: 'relative', zIndex: 99, marginBottom:'10px' }}>
                                <div style={{ margin: '0 10px 0 10px', width: '1070px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                    <div style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                        <h4 style={{margin:'0'}}>Оценить:</h4>
                                        <div>
                                            <img onClick={() => handleRate(1)} style={{ marginRight: '15px',}} src={rating >= 1 ? goldStar : Star} alt={'Star'} />
                                            <img onClick={() => handleRate(2)} style={{ marginRight: '15px',}} src={rating >= 2 ? goldStar : Star} alt={'Star'} />
                                            <img onClick={() => handleRate(3)} style={{ marginRight: '15px',}} src={rating >= 3 ? goldStar : Star} alt={'Star'} />
                                            <img onClick={() => handleRate(4)} style={{ marginRight: '15px',}} src={rating >= 4 ? goldStar : Star} alt={'Star'} />
                                            <img onClick={() => handleRate(5)} style={{}} src={rating >= 5 ? goldStar : Star} alt={'Star'} />
                                        </div>
                                    </div>

                                    <div style={{position: 'relative', display:'flex', alignItems:'center',width:'100%', marginTop:'5px'}}>
                                        <input
                                            type="text"
                                            placeholder="Имя"
                                            name="name"
                                            onChange={handleChangeName}
                                            value={ratingName.name}
                                            required
                                            className={styles.input}
                                        />
                                    </div>
                                    <div style={{width:'100%',position: 'relative', display:'flex', alignItems:'center'}}>
                                        <textarea
                                            placeholder={rating === 0 ? "Поставьте оценку перед написанием комментария" : "Напишите комментарий к оценке"}
                                            name="description"
                                            onChange={handleChange}
                                            value={ratingDesc.description}
                                            required
                                            className={`${styles.input} ${styles["input-top"]}`}
                                            style={{height: '50px', margin:'10px 0 0 0'}}
                                            disabled={rating === 0}
                                        />
                                    </div>
                                    <button onClick={handleAddRating} className={styles.submit_btn} style={{width:'100%', margin:'15px 10px'}}>
                                        Добавить
                                    </button>
                                </div>
                            </div>
                            <div style={{ margin: '10px 0 50px 10px', width: '1070px', overflow: 'auto' }}>
                                {selectedRadio.rating.map((rating, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', flexDirection:'column',padding: "10px 10px", backgroundColor:'#fff', borderRadius:'10px', textDecoration: "none", color: "#000000", marginBottom:'10px'  }}>
                                        <div style={{display:'flex',width:'100%', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                                            <p style={{ margin: '0px', fontWeight:'700', color:'#000', fontSize:'14px' }}>{rating.name}</p>
                                            <div style={{display:'flex', flexDirection:'row', marginLeft:'15px'}}>
                                              <img src={goldStar} alt="Star" style={{ marginRight: '5px', width:'18px' }} />
                                                <p style={{ margin: '0px',fontWeight:'500',}}>{rating.value}</p>
                                            </div>
                                        </div>
                                        <p style={{ wordWrap: "break-word", color:'#000',margin:'5px 5px 5px 0', fontSize:'13px' }}>
                                            {rating.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default HomeScreen;
