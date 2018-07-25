const express = require('express');
const sql = require('mssql');

const bookRouter = express.Router();

function router(nav) {
  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();

        const result = await request.query('select * from books');
        res.render('bookListView',
          {
            nav,
            title: 'library',
            books: result.recordset
          });
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView',
        {
          nav,
          title: 'library',
          book: req.book
        });
    });

  return bookRouter;
}

module.exports = router;
