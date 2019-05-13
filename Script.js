var app = new Vue({
    el: "#app",
    data: {
        moviesObject: "",
        numMovies: 3,
        seen: false,
        moviesCnt: 0,
        moviesPurch: [],
        adultTickets: [],
        childTickets: [],
        ticketTotal: [],
        cont: false,
        count: 0,
        adultPrice: 7.99,
        childPrice: 4.99,
        adultSubtotal: 0,
        childSubtotal: 0,
        subtotal: 0,
        show1: [false],
        show2: [false]
    },
    methods: {
        request: function(){
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var jsObject = JSON.parse(httpRequest.responseText);
            this.moviesObject = jsObject
            }
        },
        getImage(i){
            return "https://image.tmdb.org/t/p/w500" + this.moviesObject.results[i].poster_path
        },
        addAdult(name){
            this.seen = true;
            if (this.moviesPurch.length > 0) {
                for (let x = 0; x < this.moviesPurch.length; x++) {
                    if(name == this.moviesPurch[x]) {
                        if(this.adultTickets[x] === undefined) {
                            this.adultTickets[x] = 0;
                        }
                        this.adultTickets[x] += 1;                             
                        let hold = this.moviesCnt;
                        this.moviesCnt = 0;
                        this.moviesCnt = hold;
                        this.cont = true;
                    }
                }
                if (this.cont == false) {
                    this.adultTickets[this.count] = 0;
                    this.moviesCnt++;
                    this.show1[this.count] = false;
                    this.moviesPurch[this.count] = name;
                    this.adultTickets[this.count] += 1;
                    this.count++;
                }
            this.cont = false;
            } else {
                this.adultTickets[0] = 0;
                this.moviesCnt++;
                this.show1[0] = false;
                this.moviesPurch[0] = name;
                this.adultTickets[0] += 1;
                this.count++;
            }
            this.findTotal();
            this.findIsTrue();
        },
        addChild(name){
            this.seen = true;
            if (this.moviesPurch.length > 0) {
                for (let x = 0; x < this.moviesPurch.length; x++) {
                    if(name == this.moviesPurch[x]) {
                        if(this.childTickets[x] === undefined) {
                            this.childTickets[x] = 0;
                        }
                        this.childTickets[x] += 1;                              
                        let hold = this.moviesCnt;
                        this.moviesCnt = 0;
                        this.moviesCnt = hold;
                        this.cont = true;
                    }
                }
                if (this.cont == false) {
                    this.childTickets[this.count] = 0;
                    this.moviesCnt++;
                    this.show2[this.count] = false;
                    this.moviesPurch[this.count] = name;
                    this.childTickets[this.count] += 1;
                    this.count++;
                }
            this.cont = false;
            } else {
                this.childTickets[0] = 0;
                this.moviesCnt++;
                this.show2[0] = false;
                this.moviesPurch[0] = name;
                this.childTickets[0] += 1;
                this.count++;
            }
            this.findTotal();
            this.findIsTrue();
        },
        findTotal() {
            let adultTotal = 0;
            let childTotal = 0;
            this.subtotal = 0;
            this.adultSubtotal = 0;
            this.childSubtotal = 0;
            for(let i = 0; i < this.moviesPurch.length; i++) {
                if(this.ticketTotal[i] === undefined) {
                    this.ticketTotal[i] = 0;
                }
                if (this.adultTickets[i] !== undefined) {
                    adultTotal = (this.adultTickets[i] * this.adultPrice);
                }
                if (this.childTickets[i] !== undefined) {
                    childTotal = (this.childTickets[i] * this.childPrice);
                }
                this.ticketTotal[i] = adultTotal + childTotal;
                this.adultSubtotal += adultTotal;
                this.childSubtotal += childTotal;
                adultTotal = 0;
                childTotal = 0;
                this.subtotal += this.ticketTotal[i];
                this.findIsTrue();
            }
        },
        removeMovie(i) {
            this.moviesPurch.splice(i, 1);
            this.adultTickets.splice(i, 1);
            this.childTickets.splice(i, 1);
            this.ticketTotal.splice(i, 1);
            this.moviesCnt--;
            this.count--;
            if (this.moviesCnt == 0) {
                this.seen = false;
            }
            this.findTotal();
        },
        findIsTrue() {
            for (let i = 0; i < this.moviesCnt; i++) {
                if (this.show1[i] === undefined) {
                    this.show1[i] = false;
                }
                if (this.show2[i] === undefined) {
                    this.show2[i] = false;
                }
            }

            for (let i = 0; i < this.show1.length; i++) {
                if (this.adultTickets[i] > 0) {
                    this.show1[i] = true;
                } else {
                    this.show1[i] = false;
                }
            }

            for (let i = 0; i < this.show2.length; i++) {
                if (this.childTickets[i+1] === undefined) {
                    this.childTickets[i+1] = false;
                }
                if (this.childTickets[i] > 0) {
                    this.show2[i] = true;
                } else {
                    this.show2[i] = false;
                }
            }
            
            for (let i = 0; i < this.moviesCnt; i++) {
                if (!this.show1[i] && !this.show2[i]) {
                    this.removeMovie(i);
                }
            }
        },
        minusAdult(i) {
            this.adultTickets[i] -= 1;
            this.findIsTrue();
            this.findTotal();
        },
        minusChild(i) {
            this.childTickets[i] -= 1;
            this.findTotal();
            this.findIsTrue();
        }
    }
})
var httpRequest = new XMLHttpRequest();
        httpRequest.open("get", "https://api.themoviedb.org/3/movie/now_playing?api_key=d35e6f1bf8c1c544c9a27fedf739fa6d&language=en-US&page=1");
        httpRequest.send();

        httpRequest.onreadystatechange  = app.request;
           