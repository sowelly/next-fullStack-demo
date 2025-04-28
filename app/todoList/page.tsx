import React, {Suspense} from 'react';
import ListCom from "../components/list";

export default async () => {
    const res = await fetch('http://localhost:3000/api/todos')
    const {data} = await res.json()

    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <ListCom data={data} ></ListCom>
            </Suspense>
        </div>

    );
};