const router = require("express").Router();
const diary = require("../services/diary");

router.get("/", function(req, res) {
  diary.getall(req.body, (val) => {
    res.send(val);
  })
});

router.get("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  diary.getone(req.body, (val) => {
    res.send(val);
  })
});

router.post("/", function(req, res) {
  req.checkBody("title", "Enter a Title").isLength({
    min: 1
  });
  req.checkBody("note", "Enter a Note").isLength({
    min: 1
  });
  var errors = req.validationErrors();
  if (errors) {
    res.send(errors);
    return;
  } else {
    diary.addrecord(req.body, (val) => {
      res.send(val);
    });
  }
})

router.delete("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  diary.deleterecord(req.body, (val) => {
    res.send(val);
  });
})

router.patch("/:id", function(req, res) {
  req.body["id"] = req.params.id;
  diary.updaterecord(req.body, (val) => {
    res.send(val);
  });
})

module.exports = router;
