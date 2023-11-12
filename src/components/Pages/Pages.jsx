import React, {useContext, useEffect, useMemo, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import arrowLeft from '../../img/arrowleft.svg';
import arrowRight from '../../img/arrowright.svg';
import "./pages.css";

const Pages = observer(() => {
    const { radioStation } = useContext(Context);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const pageCount = useMemo(
        () => Math.ceil(radioStation.totalCount / radioStation.limit),
        [radioStation.totalCount, radioStation.limit]
    );

    const pages = useMemo(
        () => [...Array(pageCount)].reduce((acc, _, i) => acc.concat(i + 1), []),
        [pageCount]
    );

    const handlePrevPage = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        radioStation.setPage(radioStation.page > 1 ? radioStation.page - 1 : radioStation.page);
    };

    const handleNextPage = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        radioStation.setPage(
            radioStation.page < pageCount ? radioStation.page + 1 : radioStation.page
        );
    };

    if (pages.length <= 0) {
        return null;
    } else {
        return (
            <div className="pagination mx-auto" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                <button onClick={handlePrevPage} disabled={radioStation.page === 1} className="pagination-button">
                    <img className="pagination-button-img" src={arrowLeft} alt="left-arrow" />
                </button>
                {screenWidth < 500 ? (
                    <>
                        {pages.slice(0, 3).map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    radioStation.setPage(page);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                className={`pagination-button pagination-page ${radioStation.page === page ? 'active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        <span className="ellipsis">...</span>
                        {pages.slice(-3).map((page) => (
                            <button
                                key={page}
                                onClick={() => {
                                    radioStation.setPage(page);
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                className={`pagination-button pagination-page ${radioStation.page === page ? 'active' : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                    </>
                ) : (
                    pages.map((page) => (
                        <button
                            key={page}
                            onClick={() => {
                                radioStation.setPage(page);
                                window.scrollTo({
                                    top: 0,
                                    behavior: 'smooth',
                                });
                            }}
                            className={`pagination-button pagination-page ${radioStation.page === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))
                )}
                <button onClick={handleNextPage} disabled={radioStation.page === pageCount} className="pagination-button">
                    <img className="pagination-button-img" src={arrowRight} alt="right-arrow" />
                </button>
            </div>
        );
    }
});

export default Pages;
