let express = require("express");
let router = express.Router();

let books = require("./public/library/library")
const {json} = require("express");

router.get("/", (req, res) => {
    res.render("index", {
        title: "Library"
    });
});

router.get("/books", (req, res) =>{
    res.render("booksList", {
        title: "Library",
        books: books
    })
});

router.post("/books", (req, res) => {
    const id = books[books.length-1].id+1;
    if (isNaN(id) || req.body.name === "" || req.body.au ==="" || new Date(req.body.date) > new Date()) {
        res.render("alert",{
            title: "Library",
            image: "/public/icons/sad.png",
            msg: "Введенные Вами данные некорректны.",
            h: "location.href='/books'"
        })
        return;
    }
    console.log(req.body.date);
    books.push({
        "id": id,
        "name": req.body.name,
        "au": req.body.au,
        "date": req.body.date,
        "in_library": "да",
        "person": "-",
        "return_date": "-",
    });

    res.render("booksList", {
        title: "Library",
        books: books
    })
});

router.post("/delete", (req, res) => {
    const id = Number(req.body.num);
    for (let book of books) {
        if (book.id === id) {
            books.splice(books.indexOf(book), 1);
            res.render("table", {
                books: books
            });
        }
    }
})

router.get("/all", (req, res) => {
    res.render("table", {books: books})
})

router.get("/expired", (req, res) => {
    res.render("table", {books: books.filter(
            (book)=>{
                if(book.return_date === "-")
                    return false;
                return (new Date(book.return_date) <= new Date());
            }
        )
    })
})

router.get("/available", (req, res) => {
    res.render("table", {books: books.filter(
            (book) => {
                return book.in_library==="да";
            }
        )
    })
})


router.get("/books/:num", (req, res) => {
    const id = Number(req.params.num);
    for (let book of books) {
        if (book.id === id) {
            res.render("book", {title: 'Library', item: book});
        }
    }
});

router.post("/books/take", (req, res) => {
    if (new Date(req.body.dt) < new Date()) {
        res.render('alert', {title: 'Library', msg: "Проверьте введенные Вами данные: Возможно, Дата введена неверно.", image: "/public/icons/sad.png", h: `location.href='/books/${req.body.i}'`});
        return;
    }
    const id = Number(req.body.i);
    for (let book of books) {
        if (id === book.id) {
            book.in_library = "нет";
            book.person =  req.body.nm;
            book.return_date = req.body.dt;
            res.render('alert', {title: 'Library', msg: "Успешно! Не забудьте вернуть книгу до указанной даты.", image: "/public/icons/happy.png", h: "location.href='/books'"} );
            return;
        }
    }
});

router.post("/books/back", (req, res) => {
    const id = Number(req.body.i);
    for (let book of books) {
        if (id === book.id) {
            book.in_library = "да";
            book.person =  "-";
            book.return_data = "-";
            res.render('alert', {title: 'Library', msg: "Спасибо! Книга успешно возвращена.", image: "/public/icons/happy.png", h: "location.href='/books'"});
            return;
        }
    }
});

router.post("/books/edit", (req, res) => {
    if (new Date(req.body.dt) > new Date()) {
        res.render('alert', {title: 'Library', msg: "Проверьте, пожалуйста, дату выпуска книги", image: "/public/icons/sad.png", h: `location.href='/books/${req.body.i}'`});
        return;
    }
    const id = Number(req.body.i);
    for(let book of books) {
        if (id === book.id) {
            if (req.body.nm)
                book.name = req.body.nm;
            if (req.body.au)
                book.au = req.body.au;
            if (req.body.dt)
                book.data = req.body.dt;
            res.render('alert', {title: 'Library', msg: "Успешно! Данные отредактированы.", image: "/public/icons/happy.png", h: "location.href='/books'"});
            return;
        }
    }
});

router.get("*", (req, res)=>{
    res.status(404);
    res.end("Page not found.");
});

module.exports = router;