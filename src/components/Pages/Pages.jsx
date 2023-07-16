import React, {useContext, useMemo} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import arrowLeft from '../../img/arrowleft.svg';
import arrowRight from '../../img/arrowright.svg';
import "./pages.css";

const Pages = observer(() => {
    const { radioStation } = useContext(Context);
    const pageCount = useMemo(() => Math.ceil(radioStation.totalCount / radioStation.limit), [radioStation.totalCount, radioStation.limit]);
    const pages = useMemo(() => [...Array(pageCount)].reduce((acc, _, i) => acc.concat(i + 1), []), [pageCount]);

    const handlePrevPage = () => {
        radioStation.setPage(
            radioStation.page > 1 ? radioStation.page - 1 : radioStation.page
        );
    };
    const handleNextPage = () => {
        radioStation.setPage(
            radioStation.page < pageCount ? radioStation.page + 1 : radioStation.page
        );
    };

    if(pages <= 0){
        return null
    }else {
        return (
            <div className="pagination mt-5 mx-auto">
                <button
                    onClick={handlePrevPage}
                    disabled={radioStation.page === 1}
                    className="pagination-button"
                >
                    <img className="pagination-button-img" src={arrowLeft}></img>
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        onClick={() => radioStation.setPage(page)}
                        className={`pagination-button pagination-page ${radioStation.page === page ? 'active' : ''}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={handleNextPage}
                    disabled={radioStation.page === pageCount}
                    className="pagination-button "
                >
                    <img className="pagination-button-img" src={arrowRight}></img>
                </button>
            </div>
        );
    }
});

export default Pages;
