const Member = require('./memberModel');

class MemberRepository {
    async getAllMembers() { // Shows all existing members
        try {
            const members = await Member.find({ softDelete: false }, { __v: 0, _id: 0, softDelete: 0 }).sort({ code: 1 })
            .lean();

            // The number of books being borrowed by each member
            members.forEach(member => {
                member.numberBooksBorrowed = member.booksBorrowed.length;
            });

            return members;
        } catch (error) {
            throw new Error(`Failed to fetch members: ${error.message}`);
        }
    }

    async getMemberByCode(code) {
        try {
            const member = await Member.findOne({ code }, {__v:0, _id:0}).lean();
            member.numberBooksBorrowed = member.booksBorrowed.length;
            return member;
        } catch (error) {
            throw new Error(`Failed to fetch member with Code ${code}: ${error.message}`);
        }
    }

    async createMember(name, code) {
        try {
            const newMember = new Member({ name, code });
            await newMember.save();
            return newMember;
        } catch (error) {
            throw new Error(`Failed to create member: ${error.message}`);
        }
    }

    async updateMember(code, name) {
        try {
            const updatedMember = await Member.findOneAndUpdate({ code, softDelete: false }, { name }, { new: true });
            return updatedMember;
        } catch (error) {
            throw new Error(`Failed to update member with code ${code}: ${error.message}`);
        }
    }

    async deleteMember(code) {
        try {
            const deletedMember = await Member.findOne({ code, softDelete: false });

            if (!deletedMember) {
                throw new Error(`Member with code ${code} not found`);
            }

            deletedMember.softDelete = true;
            deletedMember.save();
            return deletedMember;
        } catch (error) {
            throw new Error(`Failed to delete member with code ${code}: ${error.message}`);
        }
    }    

    async addBookBorrowed(code, bookCode, copyCode) {
        try {
            const member = await Member.findOne({ code, softDelete: false});
            if (!member) {
                throw new Error(`Member with code ${code} not found`);
            }
            
            // // Same book check
            // let duplicateCount = 0;
            // member.booksBorrowed.forEach(book => {
            //     if (book.copyCode === copyCode && book.bookCode === bookCode) {
            //         duplicateCount++;
            //     }
            // });

            // if (duplicateCount >= 1) {
            //     throw new Error(`Member with code ${code} cannot borrow the same book the member has borrowed`);
            // }

            // Member is currently not being penalized
            if (new Date() >= member.penalizedUntil) {
                member.penalizedUntil = null;
            } else { // If still penalized
                throw new Error(`Member with code ${code} is currently penalized until ${member.penalizedUntil}`);
            }

            // Members may not borrow more than 2 books
            const bookIndex = member.booksBorrowed.length;
            if(bookIndex >= 2){
                throw new Error(`Member with code ${code} cannot borrow more than 2 books`);
            }
            
            // Borrow the book
            member.booksBorrowed.push({ bookCode, copyCode, borrowedAt: new Date() });
            await member.save();
            return member;
        } catch (error) {
            throw new Error(`Failed to add borrowed book to member with ID ${code}: ${error.message}`);
        }
    }

    async returnBook(code, bookCode, copyCode) {
        try {
            const member = await Member.findOne({ code });
            if (!member) {
                throw new Error(`Member with code ${code} not found`);
            }

            const bookIndex = member.booksBorrowed.findIndex(borrowing => 
                borrowing.copyCode === copyCode && borrowing.bookCode === bookCode
            );
    
            // The returned book is a book that the member has borrowed
            // If the book returned is indeed borrowed by the member
            if (bookIndex !== -1) {
                const borrowedBook = member.booksBorrowed[bookIndex];
                const borrowedAt = borrowedBook.borrowedAt;
                const currentDate = new Date();
                const daysBorrowed = Math.floor((currentDate - borrowedAt) / (1000 * 60 * 60 * 24));
    
                // If the book is returned after more than 7 days, the member will be subject to a penalty. 
                // Member with penalty cannot able to borrow the book for 3 days
                if (daysBorrowed > 7) {
                    // 3 Days from now
                    member.penalizedUntil = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000);
                }
    
                member.booksBorrowed.splice(bookIndex, 1);
                await member.save();
                return member;
            } else {
                throw new Error(`Borrowed book not found for member with code ${code}`);
            }
        } catch (error) {
            throw new Error(`Failed to return book for member with code ${code}: ${error.message}`);
        }    
    }
}

module.exports = new MemberRepository();
