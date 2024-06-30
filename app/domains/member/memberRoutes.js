const express = require('express');
const MemberController = require('./memberController');
const router = express.Router();

// Routes for each of the controller
router.get('/', MemberController.getAllMembers);
router.post('/', MemberController.createMember);
router.get('/:code', MemberController.getMemberByCode);
router.put('/:code', MemberController.updateMember);
router.delete('/:code', MemberController.deleteMember);
router.post('/:code/borrow', MemberController.borrowBook);
router.post('/:code/return', MemberController.returnBook);

module.exports = router;
