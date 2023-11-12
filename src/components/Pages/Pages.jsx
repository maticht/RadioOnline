import React, { useContext, useMemo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../../index';
import arrowLeft from '../../img/arrowleft.svg';
import arrowRight from '../../img/arrowright.svg';
import './pages.css';

const Pages = observer(() => {
    const { radioStation } = useContext(Context);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [visiblePages, setVisiblePages] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const initialPageCount = Math.ceil(radioStation.totalCount / radioStation.limit);
        updateVisiblePages(initialPageCount);
    }, [radioStation.totalCount, radioStation.limit]);

    const pageCount = useMemo(
        () => Math.ceil(radioStation.totalCount / radioStation.limit),
        [radioStation.totalCount, radioStation.limit]
    );

    const pages = useMemo(
        () => [...Array(pageCount)].reduce((acc, _, i) => acc.concat(i + 1), []),
        [pageCount]
    );

    const handlePrevPage = () => {
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // });
        radioStation.setPage(
            radioStation.page > 1 ? radioStation.page - 1 : radioStation.page
        );
    };

    const handleNextPage = () => {
        // window.scrollTo({
        //     top: 0,
        //     behavior: 'smooth',
        // });
        radioStation.setPage(
            radioStation.page < pageCount ? radioStation.page + 1 : radioStation.page
        );
    };

    const updateVisiblePages = (count) => {
        let maxVisiblePages = 10;

        if (screenWidth < 500 && screenWidth >= 320) {
            maxVisiblePages = 5;
        } else if (screenWidth < 320) {
            maxVisiblePages = 3;
        }

        const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2);
        let firstVisibleIndex;
        let lastVisibleIndex;

        if (radioStation.page <= halfMaxVisiblePages || radioStation.page <= 2) {
            firstVisibleIndex = 0;
            lastVisibleIndex = Math.min(maxVisiblePages - 1, count - 1);
        } else if (radioStation.page >= count - halfMaxVisiblePages || radioStation.page >= count - 1) {
            firstVisibleIndex = Math.max(0, count - maxVisiblePages);
            lastVisibleIndex = count - 1;
        } else {
            firstVisibleIndex = radioStation.page - halfMaxVisiblePages - 1;
            lastVisibleIndex = radioStation.page + halfMaxVisiblePages - 1;
        }

        setVisiblePages(
            [...Array(count)].map((_, i) => i + 1).slice(firstVisibleIndex, lastVisibleIndex + 1)
        );
    };

    useEffect(() => {
        updateVisiblePages(pageCount);
    }, [pageCount, screenWidth, radioStation.page]);

    if (pages.length <= 0) {
        return null;
    } else {
        return (
            <div className="pagination mx-auto" style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                <button onClick={handlePrevPage} disabled={radioStation.page === 1} className="pagination-button">
                    <img className="pagination-button-img" src={arrowLeft} alt="left-arrow" />
                </button>
                {visiblePages.map((page) => (
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
                <button onClick={handleNextPage} disabled={radioStation.page === pageCount} className="pagination-button">
                    <img className="pagination-button-img" src={arrowRight} alt="right-arrow" />
                </button>
            </div>
        );
    }
});

export default Pages;

