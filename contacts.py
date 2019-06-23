


import os,logging
import webapp2
import jinja2
from google.appengine.ext import ndb
from google.appengine.api import mail


class ContactMessages(ndb.Expando):

    messageid = ndb.StringProperty()
    names = ndb.StringProperty()
    email = ndb.StringProperty()
    cell = ndb.StringProperty()
    subject = ndb.StringProperty()
    body = ndb.TextProperty()
    bodyexcerpt = ndb.StringProperty()

    datesubmitted = ndb.DateProperty(auto_now_add=True)
    timesubmitted = ndb.TimeProperty(auto_now_add=True)

    responsesent = ndb.BooleanProperty(default=False)


    def create_messageid(self):
        from main import create_random_id
        try:
            messageid = create_random_id(len=12)
            logging.warning(messageid)
            return messageid
        except Exception as e:
            raise e

    def write_messageid(self,messageid):
        try:
            if messageid != None:
                self.messageid = messageid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def readDateSubmitted(self):
        try:
            strTemp = str(self.datesubmitted)

            return strTemp
        except:
            return None
    def readTimeSubmitted(self):
        try:
            strTemp = str(self.timesubmitted)


            return strTemp
        except:
            return None

    def readResposeSent(self):
        try:
            return self.responsesent
        except:
            return False

    def writeResponseSent(self,response):
        try:

            if response in [True,False]:
                self.responsesent = response
                return True
            else:
                return False
        except:
            return False

    def readNames(self):
        try:
            return self.names
        except:
            return None

    def writeNames(self,names):
        try:
            names = str(names)
            names = names.strip()

            if names != None:
                self.names = names
                return True
            else:
                return False
        except:
            return False

    def readEmail(self):
        try:
            return self.email
        except:
            return None

    def writeEmail(self,email):
        try:
            email = str(email)
            email = email.strip()

            if email != None:
                self.email = email
                return True
            else:
                return False
        except:
            return False

    def readCell(self):
        try:
            return self.cell
        except:
            return None

    def writeCell(self,cell):
        try:

            cell = str(cell)
            cell = cell.strip()

            if cell != None:
                self.cell = cell
                return True
            else:
                return False
        except:
            return False

    def readSubject(self):
        try:
            return self.subject
        except:
            return None

    def writeSubject(self,subject):
        try:
            subject = str(subject)
            subject = subject.strip()

            if subject != None:
                self.subject = subject
                return True
            else:
                return False
        except:
            return False

    def readMessage(self):

        try:
            return self.body
        except:
            return None

    def writeMessage(self,body):
        try:
            if body != None:
                self.body = body
                MessageLen = len(body)

                if MessageLen > 16:
                    self.bodyexcerpt = self.body[0:16]
                else:
                    self.bodyexcerpt = self.body

                return True
            else:
                return False
        except:
            return False




    def sendResponse(self):
        try:
            sender_address = ('support@ned-media.appspot.com')
            mail.send_mail(sender_address, self.email, self.subject, self.body)
            return True
        except:
            return False