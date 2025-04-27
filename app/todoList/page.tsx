import React, {Suspense} from 'react';
import ListCom from "../components/list";

export default async () => {
    const res = await fetch('http://localhost:3001/api/search')
    const {data} = await res.json()
    console.log('dataSource', data)


    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ListCom data={data}></ListCom>
        </Suspense>

    );
};