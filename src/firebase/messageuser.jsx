import React,{createContext, useState} from "react";

export const combinedId = createContext(null);


export function Combination({children}){
    const [chatCombinedId,setChatCombinedId] = useState("") ;

        return(
            <combinedId.Provider value={{chatCombinedId,setChatCombinedId}}>
                {children}
            </combinedId.Provider>
        )
}