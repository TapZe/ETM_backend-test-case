const MemberRepository = require('./memberRepository');

class MemberService {
    async getAllMembers() {
        return await MemberRepository.getAllMembers();
    }

    async getMemberByCode(code) {
        return await MemberRepository.getMemberByCode(code);
    }

    async createMember(name, code) {
        return await MemberRepository.createMember(name, code);
    }

    async updateMember(code, name) {
        return await MemberRepository.updateMember(code, name);
    }

    async deleteMember(code) {
        return await MemberRepository.deleteMember(code);
    }

    async borrowBook(code, bookCode, copyCode) {
        return await MemberRepository.addBookBorrowed(code, bookCode, copyCode);
    }

    async returnBook(code, bookCode, copyCode) {
        return await MemberRepository.returnBook(code, bookCode, copyCode);
    }
}

module.exports = new MemberService();
