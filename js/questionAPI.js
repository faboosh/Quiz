class QuestionFetcher{
    async fetch() {
        return new Promise((resolve, reject) => {
            let req = new XMLHttpRequest();
            req.open('GET', 'config/questions.json', true);
            req.send();   

            //Sparar innehållet från JSON-filen i 'questions', ifall det misslyckas skrivs detta ut på skärmen
            req.onload = () => {
                if (req.status >= 200 && req.status < 300) {
                    console.log('Questions loaded');
                    return resolve(JSON.parse(req.response).questions);
                    
                } else {
                    console.log('Questions failed to load');
                }
            };
        });            
    }
}