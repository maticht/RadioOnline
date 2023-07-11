import {observer} from "mobx-react-lite";
import React, {useContext} from "react";
import {Context} from "../../index";

const Footer = observer(() => {
    const {radioStation} = useContext(Context)

    const setGenreOnFooter = (genre) => {
        radioStation.setSelectGenre(genre)
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div
            style={{
                width: '100%',
                height: '486px',
                background: 'black',
                marginTop: '60px',
                justifyContent: 'center',
                alignContent: 'space-between',
                position: 'relative'
            }}
        >
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gridColumnGap: '50px',
                justifyContent: 'center',
                alignItems: 'flex-end',
                marginLeft: '173px',
                marginRight: '173px',
            }}>
                <div style={{flex: 1, marginTop: '99px', alignSelf: 'flex-start', color: 'white', cursor: 'pointer'}}>
                    {radioStation.genres.slice(0, Math.ceil(radioStation.genres.length / 4)).map((genre) => (
                        <p key={genre.id} onClick={() => setGenreOnFooter(genre)}>
                            {genre.name}({genre.numberOfRS})</p>
                    ))}
                </div>
                <div style={{flex: 1, marginTop: '99px', alignSelf: 'flex-start', color: 'white', cursor: 'pointer'}}>
                    {radioStation.genres.slice(Math.ceil(radioStation.genres.length / 4), 2 * (Math.ceil(radioStation.genres.length / 4))).map((genre) => (
                        <p key={genre.id} onClick={() => setGenreOnFooter(genre)}>
                            {genre.name}({genre.numberOfRS})</p>
                    ))}
                </div>
                <div style={{flex: 1, marginTop: '99px', alignSelf: 'flex-start', color: 'white', cursor: 'pointer'}}>
                    {radioStation.genres.slice(2 * (Math.ceil(radioStation.genres.length / 4)), 3 * (Math.ceil(radioStation.genres.length / 4))).map((genre) => (
                        <p key={genre.id} onClick={() => setGenreOnFooter(genre)}>
                            {genre.name}({genre.numberOfRS})</p>
                    ))}
                </div>
                <div style={{flex: 1, marginTop: '99px', alignSelf: 'flex-start', color: 'white', cursor: 'pointer'}}>
                    {radioStation.genres.slice(3 * (Math.ceil(radioStation.genres.length / 4)), radioStation.genres.length + 1).map((genre) => (
                        <p key={genre.id} onClick={() => setGenreOnFooter(genre)}>
                            {genre.name}({genre.numberOfRS})</p>
                    ))}
                </div>
            </div>
            <div style={{
                backgroundColor: 'white',
                padding: '20px 150px',
                alignItems: 'flex-start',
                width: '100%',
                height:'100px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                bottom: 0,
                overflow:'hidden',
                position: 'absolute',
                clipPath: 'ellipse(50% 60% at 50% 0%)',
                transform: 'rotate(180deg)'
            }}>
                <p style={{transform: 'rotate(180deg)', marginRight:'80px'}}>Правообладателям</p>
                <p style={{transform: 'rotate(180deg)', marginRight:'80px'}}>Политика конфеденциальности</p>
                <p style={{transform: 'rotate(180deg)'}}>Контакты</p>
            </div>
        </div>
    );
});

export default Footer;
