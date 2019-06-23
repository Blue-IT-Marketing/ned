import os
import webapp2
import jinja2

from google.appengine.api import users


import logging
#Jinja Loader

template_env = jinja2.Environment(
loader=jinja2.FileSystemLoader(os.getcwd()))
from main import Account,Settings,PostalAddress,PhysicalAddress,Drive,ProjectArt,Wallet


import time


class NavigationHandler(webapp2.RequestHandler):



    def SettingsRouter(self):

        userid = self.request.get('userid')

        useraction = self.request.get('useraction')

        if useraction == "save":
            logging.warning("saving settings")
            deliveryoptions = self.request.get('deliveryoptions')
            paymentoptions = self.request.get('paymentoptions')

            method_email = self.request.get('methodemail')
            method_sms = self.request.get('methodsms')
            method_phone = self.request.get('methodphone')

            subject_projects = self.request.get('subjectprojects')
            subject_delivery = self.request.get('subjectdelivery')
            subject_payments = self.request.get('subjectpayments')
            subject_promotions = self.request.get('subjectpromotions')

            settings_query = Settings.query(Settings.userid == userid)
            settings_list = settings_query.fetch()

            if len(settings_list) > 0:

                this_settings = settings_list[0]

                this_settings.write_delivery_option(option=deliveryoptions)
                this_settings.write_payment_option(payment_option=paymentoptions)


                this_settings.set_notification_method_email(set=(method_email == "true"))
                this_settings.set_notification_method_sms(set=(method_sms == "true"))
                this_settings.set_notification_method_phone(set=(method_phone == "true"))

                this_settings.set_notification_subject_projects(set=(subject_projects == "true"))
                this_settings.set_notification_subject_deliveries(set=(subject_delivery == "true"))
                this_settings.set_notification_subject_payments(set=(subject_payments == "true"))
                this_settings.set_notification_subject_promotions(set=(subject_promotions == "true"))

                this_settings.put()

            else:
                this_settings = Settings()
                this_settings.write_userid(userid=userid)
                this_settings.put()

            template = template_env.get_template('templates/pages/settings.html')
            context = {'this_settings': this_settings}
            self.response.write(template.render(context))
        else:
            logging.warning("reading settings")
            settings_query = Settings.query(Settings.userid == userid)
            settings_list = settings_query.fetch()

            if len(settings_list) > 0:
                this_settings = settings_list[0]
            else:
                this_settings = Settings()
                this_settings.write_userid(userid=userid)
                this_settings.put()

            template = template_env.get_template('templates/pages/settings.html')
            context = {'this_settings': this_settings}
            self.response.write(template.render(context))


    def RouteProfile(self):
        """
        :rtype: object
        """
        userid = self.request.get('userid')
        useraction = self.request.get('useraction')

        if useraction == "save":

            names = self.request.get('names')
            cell = self.request.get('cell')
            email = self.request.get('email')
            website = self.request.get('website')

            photourl = self.request.get('photourl')

            box = self.request.get('box')
            postalcity = self.request.get('city')
            postalprovince = self.request.get('province')
            postalcode = self.request.get('postalcode')

            stand = self.request.get('stand')
            street = self.request.get('street')
            physicalcity = self.request.get('physicalcity')
            physicalprovince = self.request.get('physicalprovince')
            physicalcode = self.request.get('physicalcode')

            account_request = Account.query(Account.userid == userid)
            this_account_list = account_request.fetch()

            postal_request = PostalAddress.query(PostalAddress.userid == userid)
            this_postal_list = postal_request.fetch()

            physical_request = PhysicalAddress.query(PhysicalAddress.userid == userid)
            this_physical_list = physical_request.fetch()

            wallet_request = Wallet.query(Wallet.userid == userid)
            this_wallet_list = wallet_request.fetch()

            if len(this_account_list) > 0:
                this_account = this_account_list[0]

                if len(this_postal_list) > 0:
                    this_postal = this_postal_list[0]
                else:
                    this_postal = PostalAddress()
                    this_postal.write_userid(userid=userid)

                if len(this_physical_list) > 0:
                    this_physical = this_physical_list[0]
                else:
                    this_physical = PhysicalAddress()
                    this_physical.write_userid(userid=userid)


                if len(this_wallet_list) > 0:
                    this_wallet = this_wallet_list[0]
                else:
                    this_wallet = Wallet()
                    this_wallet.write_userid(userid=userid)
                    this_wallet.put()




                this_account.write_names(names=names)
                this_account.write_cell(cell=cell)
                this_account.write_email(email=email)
                this_account.write_website(website=website)

                this_account.write_photourl(photourl=photourl)
                this_account.put()

                this_postal.write_box(box=box)
                this_postal.write_city(city=postalcity)
                this_postal.write_province(province=postalprovince)
                this_postal.write_postalcode(postalcode=postalcode)

                this_postal.put()

                this_physical.write_stand(stand=stand)
                this_physical.write_streetname(streetname=street)
                this_physical.write_city(city=physicalcity)
                this_physical.write_province(province=physicalprovince)
                this_physical.write_postalcode(postalcode=physicalcode)

                this_physical.put()

                self.response.write("successfully updated profile information")

        else:
            account_request = Account.query(Account.userid == userid)
            this_account_list = account_request.fetch()

            postal_request = PostalAddress.query(PostalAddress.userid == userid)
            this_postal_list = postal_request.fetch()

            physical_request = PhysicalAddress.query(PhysicalAddress.userid == userid)
            this_physical_list = physical_request.fetch()

            wallet_request = Wallet.query(Wallet.userid == userid)
            this_wallet_list = wallet_request.fetch()


            if len(this_account_list) > 0:
                this_account = this_account_list[0]

                if len(this_postal_list) > 0:
                    this_postal = this_postal_list[0]
                else:
                    this_postal = PostalAddress()
                    this_postal.write_userid(userid=userid)
                    this_postal.put()

                if len(this_physical_list) > 0:
                    this_physical = this_physical_list[0]
                else:
                    this_physical = PhysicalAddress()
                    this_physical.write_userid(userid=userid)
                    this_physical.put()

                if len(this_wallet_list) > 0:
                    this_wallet = this_wallet_list[0]
                else:
                    this_wallet = Wallet()
                    this_wallet.write_userid(userid=userid)
                    this_wallet.put()


                template = template_env.get_template('templates/pages/profile.html')
                context = {'this_account': this_account, 'this_postal': this_postal, 'this_physical': this_physical,'this_wallet':this_wallet}
                self.response.write(template.render(context))
            else:
                this_account = Account()
                this_account.write_userid(userid=userid)
                this_account.put()

                this_postal = PostalAddress()
                this_postal.write_userid(userid=userid)
                this_postal.put()

                this_physical = PhysicalAddress()
                this_physical.write_userid(userid=userid)
                this_physical.put()

                this_wallet = Wallet()
                this_wallet.write_userid(userid=userid)
                this_wallet.put()

                template = template_env.get_template('templates/pages/profile.html')
                context = {'this_account': this_account, 'this_postal': this_postal, 'this_physical': this_physical,
                           'this_wallet': this_wallet}
                self.response.write(template.render(context))



    def get(self):
        url = str(self.request.url)
        router = url.split("/")
        router = router[len(router) - 1]


        if router == "home":
            from main import Products
            products_query = Products.query()
            products_list = products_query.fetch()

            template = template_env.get_template('templates/pages/home.html')
            context = {'products_list':products_list}
            self.response.write(template.render(context))

        elif router == "about":
            template = template_env.get_template('templates/pages/about.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "contact":
            template = template_env.get_template('templates/pages/contact.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "services":
            template = template_env.get_template('templates/pages/services.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "createaccount":
            template = template_env.get_template('templates/pages/createaccount.html')
            context = {}
            self.response.write(template.render(context))


        elif router == "login":
            template = template_env.get_template('templates/pages/login.html')
            context = {}
            self.response.write(template.render(context))


        elif router == "header":

            template = template_env.get_template('templates/nav/header.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "sidebar":

            adminloginlink = users.create_login_url(dest_url="/")

            template = template_env.get_template('templates/nav/sidebar.html')
            context = {'adminloginlink':adminloginlink}
            self.response.write(template.render(context))


    def post(self):


        router = self.request.get('route')

        logging.info(router)

        if router == "login":

            template = template_env.get_template('templates/pages/login.html')
            context = {}
            self.response.write(template.render(context))


        elif router == "new-user":
            names = self.request.get('names')
            email = self.request.get('email')
            password = self.request.get('password')
            userid = self.request.get('userid')

            account_request = Account.query(Account.userid == userid)
            account_list = account_request.fetch()

            if len(account_list) == 0:
                account = Account()

                account.write_names(names=names)
                account.write_email(email=email)
                account.write_userid(userid=userid)
                account.write_password(password=password)
                account.put()
                self.response.write('successfully created a new user account')
            else:
                self.response.write('you already have an account please login')



        elif router == "settings":

            self.SettingsRouter()

        elif router == "profile":
            self.RouteProfile()

        elif router == "drive":
            userid = self.request.get('userid')

            drive_request = Drive.query(Drive.userid == userid)
            this_drive_list = drive_request.fetch()

            if len(this_drive_list) > 0:
                this_drive = this_drive_list[0]
            else:

                this_drive = Drive()
                this_drive.write_driveid(driveid=this_drive.create_driveid())
                this_drive.put()

            art_request = ProjectArt.query(ProjectArt.driveid == this_drive.driveid)
            this_art_files = art_request.fetch()

            template = template_env.get_template('templates/pages/drive.html')
            context = {'this_drive':this_drive,'this_art_files':this_art_files}
            self.response.write(template.render(context))

        elif router == "addfunds":

            template = template_env.get_template('templates/pages/addfunds.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "projects":
            template = template_env.get_template('templates/pages/projects.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "chat":
            template = template_env.get_template('templates/pages/chat.html')
            context = {}
            self.response.write(template.render(context))

        elif router == "dashboard":
            #TODO- note that the admin can login through the dashboard link ... /dashboard
            if users.is_current_user_admin():

                template = template_env.get_template('templates/pages/dashboard.html')
                context = {}
                self.response.write(template.render(context))
            else:

                template = template_env.get_template('templates/pages/500.html')
                context = {}
                self.response.write(template.render(context))

        elif router == "inbox":

            template = template_env.get_template('templates/pages/inbox.htm')
            context = {}
            self.response.write(template.render(context))


        elif router == "logout":

            template = template_env.get_template('templates/pages/logout.html')
            context = {}
            self.response.write(template.render(context))
            

app = webapp2.WSGIApplication([
    ('/nav/.*', NavigationHandler)
], debug=True)