class FetchJson{
    async fetch(url) {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.send();   

            //Sparar innehållet från JSON-filen i 'questions', ifall det misslyckas skrivs detta ut på skärmen
            req.onload = () => {
                if (req.status >= 200 && req.status < 300) {
                    console.log('Loaded ' + url);
                    return resolve(JSON.parse(req.response));
                    
                } else {
                    alert.log('Failed to load ' + url);
                }
            };
        });            
    }
}