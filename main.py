#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import os
import webapp2
import jinja2
from google.appengine.ext import ndb
from google.appengine.api import users
from google.appengine.api import urlfetch
import logging
import datetime
template_env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.getcwd()))
import time
mytime={
    'now':int(time.time()),
    'strftime':time.strftime }

def create_random_id(len):
    import random,string
    try:
        id = ""
        for i in range(len):
            id += random.SystemRandom().choice(string.digits + string.ascii_uppercase)
            logging.warning(id)
        return id
    except:
        return ""

class Account(ndb.Expando):

    userid = ndb.StringProperty()
    names = ndb.StringProperty()
    cell = ndb.StringProperty()
    email = ndb.StringProperty()
    password = ndb.StringProperty()
    website = ndb.StringProperty()

    photourl = ndb.StringProperty()
    signedin = ndb.BooleanProperty(default=False)

    last_signin_date = ndb.DateProperty(auto_now_add=True)
    last_signin_time = ndb.TimeProperty(auto_now_add=True)


    twofactorcode = ndb.StringProperty()
    two_factor_enabled = ndb.BooleanProperty(default=False)


    def write_password(self,password):
        try:
            if password != None:
                self.password = password
                return True
            else:
                return False
        except Exception as e:
            raise e


    def set_two_factor(self,set):
        try:
            if set in [True,False]:
                self.two_factor_enabled = set
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_twofactorcode(self,code):
        try:
            if code != None:
                self.twofactorcode  =code
                return True
            else:
                return False
        except Exception as e:
            raise e

    def code_match(self,code):
        try:
            if code == self.twofactorcode:
                return True
            else:
                return False
        except Exception as e:
            raise e

    def create_twofactor_code(self):
        try:
            return create_random_id(len=6)
        except Exception as e:
            raise e

    def send_code(self):
        try:
            # TODO - send code by sms
            pass
        except Exception as e:
            raise e


    def write_cell(self,cell):
        try:
            if cell != None:
                self.cell = cell
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return  False

        except Exception as e:
            raise e

    def write_names(self,names):
        try:
            if names != None:
                self.names = names
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_email(self,email):
        try:
            if email != None:
                self.email = email
                return True
            else:
                return  False
        except Exception as e:
            raise e


    def write_photourl(self,photourl):
        try:
            if photourl != None:
                self.photourl = photourl
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_website(self,website):
        try:
            if website != None:
                self.website = website
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_signedin(self,signedin):
        try:
            if signedin in [True,False]:
                self.signedin = signedin
                return True
            else:
                return False
        except Exception as e:
            raise e


class Wallet(ndb.Expando):
    userid = ndb.StringProperty()
    balance = ndb.FloatProperty(default=0)
    owed = ndb.FloatProperty(default=0)

    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_balance(self,balance):
        try:
            if isinstance(balance,float):
                self.balance  = balance
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_owed(self,owed):
        try:
            if isinstance(owed,float):
                self.owed = owed
                return True
            else:
                return False
        except Exception as e:
            raise e

    def add_balance(self,balance):
        try:
            if isinstance(balance,float):
                self.balance += balance
                return True
            else:
                return False
        except Exception as e:
            raise e

    def sub_balance(self,balance):
        try:
            if isinstance(balance,float):
                self.balance -= balance
                return True
            else:
                return False
        except Exception as e:
            raise e


    def add_owed(self,owed):
        try:
            if isinstance(owed,float):
                self.owed += owed
                return True
            else:
                return False
        except Exception as e:
            raise e


    def sub_owed(self,owed):
        try:
            if isinstance(owed,float):
                self.owed -= owed
                return True
            else:
                return True
        except Exception as e:
            raise e


    def balance_account(self):
        try:
            if (self.balance > 0) and (self.owed > 0) and (self.balance < self.owed):

                self.owed = self.owed - self.balance
                self.balance = 0

            elif (self.balance > 0) and (self.owed > 0) and (self.owed < self.balance):
                self.balance = self.balance - self.owed
                self.owed = 0

            elif (self.balance > 0) and (self.owed > 0) and (self.owed == self.balance):
                self.balance = 0
                self.owed = 0

            return True
        except Exception as e:
            raise e



class PostalAddress(ndb.Expando):
    userid = ndb.StringProperty()
    box = ndb.StringProperty()
    city = ndb.StringProperty()
    province = ndb.StringProperty()
    postalcode = ndb.StringProperty()


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except:
            return False

    def write_box(self,box):
        try:
            if box != None:
                self.box = box
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_city(self,city):
        try:
            if city != None:
                self.city = city
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_province(self,province):
        try:
            if province != None:
                self.province = province
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_postalcode(self,postalcode):
        try:
            if postalcode != None:
                self.postalcode = postalcode
                return True
            else:
                return False
        except Exception as e:
            raise e

class PhysicalAddress(ndb.Expando):
    userid = ndb.StringProperty()
    stand = ndb.StringProperty()
    streetname = ndb.StringProperty()
    city = ndb.StringProperty()
    province = ndb.StringProperty()
    postalcode = ndb.StringProperty()

    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_stand(self,stand):
        try:
            if stand != None:
                self.stand = stand
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_streetname(self,streetname):
        try:
            if streetname != None:
                self.streetname = streetname
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_city(self,city):
        try:
            if city != None:
                self.city = city
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_province(self,province):
        try:
            if province != None:
                self.province = province
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_postalcode(self,postalcode):
        try:
            if postalcode != None:
                self.postalcode = postalcode
                return True
            else:
                return False
        except Exception as e:
            raise e

class Settings(ndb.Expando):

    userid = ndb.StringProperty()

    delivery_options = ndb.StringProperty(default="courier") # postal, courier, pickup / own delivery
    payment_options = ndb.StringProperty(default="cod") # directdeposit ,eft

    notification_method_sms = ndb.BooleanProperty(default=True)
    notification_method_email = ndb.BooleanProperty(default=True)
    notification_method_phone = ndb.BooleanProperty(default=False)

    notification_subject_projects = ndb.BooleanProperty(default=True)
    notification_subject_deliveries = ndb.BooleanProperty(default=True)
    notification_subject_payments = ndb.BooleanProperty(default=True)
    notification_subject_specials = ndb.BooleanProperty(default=True)
    notification_subject_promotions = ndb.BooleanProperty(default=True)
    notification_subject_discounts = ndb.BooleanProperty(default=True)



    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except:
            return False
    def write_payment_option(self,payment_option):
        try:
            if payment_option in ["cod","directdeposit","eft"]:
                self.payment_options = payment_option
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_delivery_option(self,option):
        try:
            if option in ["pickup","postal","courier"]:
                self.delivery_options = option
                return True
            else:
                return False
        except:
            return False

    def set_notification_method_sms(self,set):
        try:
            if set in [True,False]:
                self.notification_method_sms = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_method_email(self,set):
        try:
            if set in [True,False]:
                self.notification_method_email = set
                return True
            else:
                return False

        except:
            return False
    def set_notification_method_phone(self,set):
        try:
            if set in [True,False]:
                self.notification_method_phone = set
                return True
            else:
                return False
        except:
            return False


    def set_notification_subject_projects(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_projects = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_subject_deliveries(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_deliveries = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_subject_payments(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_payments = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_subject_specials(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_specials = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_subject_promotions(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_promotions = set
                return True
            else:
                return False
        except:
            return False
    def set_notification_subject_discounts(self,set):
        try:
            if set in [True,False]:
                self.notification_subject_discounts = set
                return True
            else:
                return False
        except:
            return False

class Category(ndb.Expando):

    _category_code_len = 6

    category_code = ndb.StringProperty()
    category_name = ndb.StringProperty()
    category_description = ndb.StringProperty()

    # Store images in firebase and then their image_url here
    image_url = ndb.StringProperty()


    def create_category_id(self):
        return create_random_id(len=self._category_code_len)

    def write_category_code(self,category_code):
        try:
            if category_code != None:
                self.category_code = category_code
                return True
            else:
                return False
        except:
            return False
    def write_category_name(self,category_name):
        try:
            if category_name != None:
                self.category_name = category_name
                return True
            else:
                return False
        except:
            return False
    def write_category_description(self,category_description):
        try:
            if category_description != None:
                self.category_description = category_description
                return True
            else:
                return False
        except:
            return False
    def write_image_url(self,image_url):
        try:
            if image_url != None:
                self.image_url = image_url
                return True
            else:
                return False
        except:
            return False

class Products(ndb.Expando):
    _product_code_len = 6

    product_code = ndb.StringProperty()
    product_name = ndb.StringProperty()
    product_description = ndb.StringProperty()

    product_image_url = ndb.StringProperty()



    product_category_code = ndb.StringProperty()



    price_per_item = ndb.FloatProperty(default=0)
    product_uom = ndb.IntegerProperty(default=100)
    cost_per_item = ndb.FloatProperty(default=0)

    def create_product_code(self):
        return create_random_id(len=self._product_code_len)

    def write_product_code(self,product_code):
        try:
            if product_code != None:
                self.product_code = product_code
                return True
            else:
                return False
        except:
            return False
    def write_product_name(self,product_name):
        try:
            if product_name != None:
                self.product_name = product_name
                return True
            else:
                return False
        except:
            return False
    def write_product_description(self,product_description):
        try:
            if product_description != None:
                self.product_description = product_description
                return True
            else:
                return False
        except:
            return False
    def write_product_image_url(self,product_image_url):
        try:
            if product_image_url != None:
                self.product_image_url = product_image_url
                return True
            else:
                return False
        except:
            return False
    def write_product_category_code(self,category_code):
        try:
            if category_code != None:
                self.product_category_code = category_code
                return True
            else:
                return False
        except:
            return False
    def write_price_per_item(self,price_per_item):
        try:
            if isinstance(price_per_item,float):
                self.price_per_item = price_per_item
                return True
            else:
                return False
        except:
            return False
    def write_product_uom(self,uom):
        try:
            if uom.isdigit():
                self.product_uom = uom
                return True
            else:
                return False
        except:
            return False
    def write_cost_per_item(self,cost):
        try:
            if isinstance(cost,float):
                self.cost_per_item = cost
                return True
            else:
                return False
        except:
            return False

class Orders(ndb.Expando):
    _order_num_len = 6

    userid = ndb.StringProperty()
    names = ndb.StringProperty()

    order_number = ndb.StringProperty()

    order_date = ndb.DateProperty(auto_now_add=True)
    order_time = ndb.TimeProperty(auto_now_add=True)
    total_order_amount = ndb.FloatProperty(default=0)

    order_started = ndb.BooleanProperty(default=False)
    order_ended = ndb.BooleanProperty(default=False)


    def write_names(self,names):
        try:
            if names != None:
                self.names = names
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def set_order_started(self,started):
        try:

            if started in [True,False]:
                self.order_started = started
                return True
            else:
                return False
        except Exception as e:
            raise e


    def set_order_ended(self,ended):
        try:
            if ended in [True,False]:
                self.order_ended = ended
                return True
            else:
                return False
        except Exception as e:
            raise e

    def create_order_number (self):
        return create_random_id(self._order_num_len)

    def write_order_number(self,ordernum):
        try:
            if ordernum != None:
                self.order_number = ordernum
                return True
            else:
                return False
        except:
            return False


    def write_order_date(self,orderdate):
        try:
            if isinstance(orderdate,datetime.date):
                self.order_date = orderdate
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_order_time(self,ordertime):
        try:
            if isinstance(ordertime,datetime.time):
                self.order_time = ordertime
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_total_order_amount(self,amount):
        try:
            if isinstance(amount,float):
                self.total_order_amount = amount
                return True
            else:
                return False
        except Exception as e:
            raise e

class Order_Detail(ndb.Expando):
    order_number = ndb.StringProperty()
    product_code = ndb.StringProperty()
    product_name = ndb.StringProperty()
    order_quantity = ndb.IntegerProperty()
    price_per_item = ndb.FloatProperty()
    date_order_placed = ndb.DateProperty(auto_now_add=True)
    time_order_placed = ndb.TimeProperty(auto_now_add=True)


    def write_order_number(self,order_number):
        try:
            if order_number != None:
                self.order_number = order_number
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_product_code(self,product_code):
        try:
            if product_code != None:
                self.product_code = product_code
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_product_name(self,product_name):
        try:
            if product_name != None:
                self.product_name = product_name
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_order_quantity(self,quantity):
        try:
            if quantity != None:
                self.order_quantity = quantity
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_price_per_item(self,itemprice):
        try:
            if isinstance(itemprice,float):
                self.price_per_item = itemprice
                return True
            else:
                return False
        except Exception as e:
            raise e

class Payments(ndb.Expando):
    userid = ndb.StringProperty()
    order_number = ndb.StringProperty()
    reference = ndb.StringProperty()
    payment_amount = ndb.FloatProperty()
    actual_paid = ndb.FloatProperty()
    date_created = ndb.DateProperty(auto_now_add=True)
    time_created = ndb.TimeProperty(auto_now_add=True)
    date_paid = ndb.DateProperty()
    time_paid = ndb.TimeProperty()


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_order_number(self,order_number):
        try:
            if order_number != None:
                self.order_number = order_number
                return True
            else:
                return False
        except Exception as e:
            raise e
    def create_reference(self,reference):
        return create_random_id(len=6)
    def write_payment_amount(self,payment_amount):
        try:
            if isinstance(payment_amount,float):
                self.payment_amount = payment_amount
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_actual_paid(self,actual_paid):
        try:
            if isinstance(actual_paid,float):
                self.actual_paid = actual_paid
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_date_paid(self,date_paid):
        try:
            if isinstance(date_paid,datetime.date):
                self.date_paid = date_paid
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_time_paid(self,time_paid):
        try:
            if isinstance(time_paid,datetime.time):
                self.time_paid = time_paid
                return True
            else:
                return False
        except Exception as e:
            raise e

class CompanySetup(ndb.Expando):
    userid = ndb.StringProperty()
    company_id = ndb.StringProperty()
    company_name = ndb.StringProperty()
    company_description = ndb.StringProperty()

    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_company_id(self,company_id):
        try:
            if company_id != None:
                self.company_id = company_id
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_company_name(self,company_name):
        try:
            if company_name != None:
                self.company_name = company_name
                return True
            else:
                return False

        except Exception as e:
            raise e

    def write_company_decription(self,company_description):
        try:
            if company_description != None:
                self.company_description = company_description
                return True
            else:
                return False
        except Exception as e:
            raise e

class CompanyContactsSetup(ndb.Expando):
    userid = ndb.StringProperty()
    company_id = ndb.StringProperty()
    contact_person = ndb.StringProperty()
    tel = ndb.StringProperty()
    cell = ndb.StringProperty()
    email = ndb.StringProperty()
    website = ndb.StringProperty()
    fax = ndb.StringProperty()


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False

        except Exception as e:
            raise e
    def write_company_id(self,company_id):
        try:
            if company_id != None:
                self.company_id = company_id
                return True
            else:
                return False

        except Exception as e:
            raise e
    def write_contact_person(self,contact_person):
        try:
            if contact_person != None:
                self.contact_person = contact_person
                return True
            else:
                return False

        except Exception as e:
            raise e
    def write_tel(self,tel):
        try:
            if tel != None:
                self.tel = tel
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_cell(self,cell):
        try:
            if cell != None:
                self.cell = cell
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_email(self,email):
        try:
            if email != None:
                self.email = email
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_website(self,website):
        try:
            if website != None:
                self.website = website
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_fax(self,fax):
        try:
            if fax != None:
                self.fax = fax
                return True
            else:
                return False
        except Exception as e:
            raise e

class Company_physical_address(ndb.Expando):
    userid = ndb.StringProperty()
    company_id = ndb.StringProperty()
    stand = ndb.StringProperty()
    street_name = ndb.StringProperty()
    city = ndb.StringProperty()
    province = ndb.StringProperty()
    postal_code = ndb.StringProperty()


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except:
            return False
    def write_company_id(self,company_id):
        try:
            if company_id != None:
                self.company_id = company_id
                return True
            else:
                return False
        except:
            return False
    def write_stand(self,stand):
        try:
            if stand != None:
                self.stand  = stand
                return True
            else:
                return False

        except:
            return False
    def write_street_name(self,street_name):
        try:
            if street_name != None:
                self.street_name = street_name
                return True
            else:
                return False
        except:
            return False
    def write_city(self,city):
        try:
            if city != None:
                self.city = city
                return True
            else:
                return False
        except:
            return False
    def write_province(self,province):
        try:
            if province != None:
                self.province = province
                return True
            else:
                return False
        except:
            return False
    def write_postal_code(self,postal_code):
        try:
            if postal_code != None:
                self.postal_code = postal_code
                return True
            else:
                return False
        except:
            return False


class Company_Account(ndb.Expando):

    userid = ndb.StringProperty()
    company_id = ndb.StringProperty()

    account_holder = ndb.StringProperty()
    account_number = ndb.StringProperty()
    account_type = ndb.StringProperty()
    bank_name = ndb.StringProperty()
    branch_name = ndb.StringProperty()
    branch_code = ndb.StringProperty()



    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except:
            return False
    def write_company_id (self,company_id):
        try:
            if company_id != None:
                self.company_id = company_id
                return True
            else:
                return False
        except:
            return False

    def write_account_holder(self,account_holder):
        try:
            if account_holder != None:
                self.account_holder = account_holder
                return True
            else:
                return False
        except:
            return False


    def write_account_number(self,account_number):
        try:
            if account_number != None:
                self.account_number = account_number
                return True
            else:
                return False
        except:
            return False
    def write_account_type(self,account_type):
        try:
            if account_type != None:
                self.account_type = account_type
                return True
            else:
                return False
        except:
            return False
    def write_bank_name(self,bank_name):
        try:
            if bank_name != None:
                self.bank_name = bank_name
                return True
            else:
                return False
        except:
            return False
    def write_branch_name(self,branch_name):
        try:
            if branch_name != None:
                self.branch_name = branch_name
                return True
            else:
                return False
        except:
            return False
    def write_branch_code(self,branch_code):
        try:
            if branch_code != None:
                self.branch_code = branch_code
                return True
            else:
                return False

        except:
            return False








class AccountSetup(ndb.Expando):
    userid = ndb.StringProperty()
    company_id = ndb.StringProperty()
    account_holder = ndb.StringProperty()
    account_name = ndb.StringProperty(default="cheque")
    account_number = ndb.StringProperty()

    bank_name = ndb.StringProperty()
    branch_name = ndb.StringProperty()
    branch_code = ndb.StringProperty()

    def write_userid(self,userid):
        try:

            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_company_id(self,company_id):
        try:
            if company_id != None:
                self.company_id = company_id
                return True
            else:
                return False
        except Exception as e:
            raise e

class Drive(ndb.Expando):

    userid = ndb.StringProperty()
    driveid = ndb.StringProperty()

    drive_size = ndb.IntegerProperty(default=500)

    present_size = ndb.IntegerProperty(default=0)

    total_files = ndb.IntegerProperty(default=0)

    def create_driveid(self):
        try:
            return create_random_id(len=12)
        except Exception as e:
            raise e


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_driveid(self,driveid):
        try:
            if driveid != None:
                self.driveid = driveid
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_drive_size(self,drive_size):
        try:
            drive_size = str(drive_size)

            if drive_size.isdigit() and (int(drive_size) > 0):
                self.drive_size = int(drive_size)
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_present_size(self,present_size):
        try:
            present_size = str(present_size)
            if present_size.isdigit() and (int(present_size) > 0):
                self.present_size = int(present_size)
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_total_files(self,total_files):
        try:
            total_files = str(total_files)
            if total_files.isdigit() and (int(total_files) > 0):
                self.total_files = int(total_files)
                return True
            else:
                return False
        except Exception as e:
            raise e


class Chat(ndb.Expando):
    userid = ndb.StringProperty()
    channelid = ndb.StringProperty()
    user_active = ndb.BooleanProperty(default=False)


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_channelid(self,channelid):
        try:
            if channelid != None:
                self.channelid = channelid
                return True
            else:
                return False
        except Exception as e:
            raise e


    def write_user_active(self,user_active):
        try:
            if user_active in [True,False]:
                self.user_active = user_active
                return True
            else:
                return False
        except Exception as e:
            raise e


class Channel(ndb.Expando):
    channelid = ndb.StringProperty()
    channel = ndb.StringProperty(default="open-channel")
    channel_active = ndb.BooleanProperty(default=False)
    is_channel_public = ndb.BooleanProperty(default=True)

    total_unread = ndb.IntegerProperty(default=0)


    def write_total_unread(self,unread):
        try:
            unread = str(unread)
            if unread.isdigit() and (int(unread) >= 0):
                self.total_unread = int(unread)
                return True
            else:
                return False
        except:
            return False

    def set_channel_public(self,is_public):
        try:
            if is_public in [True,False]:
                self.is_channel_public = is_public
                return True
            else:
                return False
        except Exception as e:
            raise e

    def set_channel_active(self,isactive):
        try:
            if isactive in [True,False]:
                self.channel_active = isactive
                return True
            else:
                return False
        except Exception as e:
            raise e



    def create_channelid(self):
        try:
            return create_random_id(len=6)
        except Exception as e:
            raise e

    def write_channelid(self,channelid):
        try:
            if channelid != None:
                self.channelid = channelid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_channel(self,channel):
        try:
            if channel != None:
                self.channel = channel
                return True
            else:
                return False
        except Exception as e:
            raise e


class Messages(ndb.Expando):
    userid = ndb.StringProperty()
    messageid = ndb.StringProperty()
    message = ndb.StringProperty()
    message_timestamp = ndb.FloatProperty()
    channelid = ndb.StringProperty()


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def create_messageid(self):
        try:
            return create_random_id(len=128)
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

    def write_message(self,message):
        try:
            message = str(message)
            if message.isalnum():
                self.message = message
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_message_timestamp(self,timestamp):
        try:

            if isinstance(timestamp,float):
                self.message_timestamp = timestamp
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_channelid(self,channelid):
        try:
            if channelid != None:
                self.channelid = channelid
                return True
            else:
                return False
        except Exception as e:
            raise e






class ProjectArt(ndb.Expando):

    userid = ndb.StringProperty()

    driveid = ndb.StringProperty()

    order_number = ndb.StringProperty()
    folder_name = ndb.StringProperty()

    fileid = ndb.StringProperty()
    filename = ndb.StringProperty()
    filesize = ndb.IntegerProperty()

    art_url = ndb.StringProperty()
    art_notes = ndb.StringProperty()

    date_uploaded = ndb.DateProperty(auto_now_add=True)
    time_uploaded = ndb.TimeProperty(auto_now_add=True)


    def write_userid(self,userid):
        try:
            if userid != None:
                self.userid = userid
                return True
            else:
                return False

        except Exception as e:
            raise e

    def write_driveid(self,driveid):
        try:
            if driveid != None:
                self.driveid = driveid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def create_filedid(self):
        try:
            return create_random_id(len=12)
        except Exception as e:
            raise e

    def write_fileid(self,fileid):
        try:
            if fileid != None:
                self.fileid = fileid
                return True
            else:
                return False
        except Exception as e:
            raise e

    def write_order_number(self,order_number):
        try:
            if order_number != None:
                self.order_number = order_number
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_filename(self,filename):
        try:
            if filename != None:
                self.filename = filename
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_art_url(self,art_url):
        try:
            if art_url != None:
                self.art_url = art_url
                return True
            else:
                return False
        except Exception as e:
            raise e
    def write_art_notes(self,art_notes):
        try:
            if art_notes != None:
                self.art_notes = art_notes
                return True
            else:
                return False
        except Exception as e:
            raise e




class MainHandler(webapp2.RequestHandler):

    def get(self):

        template = template_env.get_template('templates/index.html')
        context = {}
        self.response.write(template.render(context))

    def post(self):

        router = self.request.uri
        router = router.split("/")
        router = router[len(router) - 1]

        if router == 'contacts':
            from contacts import ContactMessages

            names = self.request.get('names')
            cell = self.request.get('cell')
            email = self.request.get('email')
            subject = self.request.get('subject')
            body = self.request.get('body')

            thisdate = datetime.datetime.now()
            thisdate = thisdate.date()

            find_request = ContactMessages.query(ContactMessages.datesubmitted == thisdate,ContactMessages.cell == cell)
            this_contact_list = find_request.fetch()

            if len(this_contact_list) > 0:
                self.response.write('you can only send one message at a time thank you')
            else:
                thiscontact = ContactMessages()
                thiscontact.writeNames(names=names)
                thiscontact.writeCell(cell=cell)
                thiscontact.writeEmail(email=email)
                thiscontact.writeSubject(subject=subject)
                thiscontact.writeMessage(body=body)
                messageid = thiscontact.create_messageid()
                logging.warning(messageid)
                thiscontact.write_messageid(messageid=messageid)
                thiscontact.put()
                self.response.write('message successfully sent')

        elif router == "create-two-factor":
            userid = self.request.get('userid')

            account_request = Account.query(Account.userid == userid)
            this_account_list = account_request.fetch()

            if len(this_account_list) > 0:

                this_account = this_account_list[0]

                this_account.write_twofactorcode(code=this_account.create_twofactor_code())
                this_account.send_code()
                this_account.put()

                self.response.write('check your cell phone sms for your activation code')
            else:
                self.response.write('fatal error with your account')

        elif router == "activate-two-factor":
            userid = self.request.get('userid')
            smscode = self.request.get('smscode')
            account_request = Account.query(Account.userid == userid)
            this_account_list = account_request.fetch()

            if len(this_account_list) > 0:
                this_account = this_account_list[0]
                this_account.set_two_factor(set=this_account.code_match(code=smscode))
                this_account.put()
                this_account = Account()
                if this_account.two_factor_enabled:
                    self.response.write('two factor code enabled')
                else:
                    self.response.write('two factor code dont match')
            else:
                self.response.write('fatal error with your account')


class DashboardHandler(webapp2.RequestHandler):

    def get(self):

        if users.is_current_user_admin():
            url = self.request.uri
            url_list = url.split("/")
            router = url_list[len(url_list) - 1]

            if router == "dash-clients":
                clients_query = Account.query()
                clients_list = clients_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/clients.html')
                context = {'clients_list':clients_list}
                self.response.write(template.render(context))

            elif router == "dash-orders":
                orders_query = Orders.query()
                orders_list = orders_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/orders.html')
                context = {'orders_list':orders_list}
                self.response.write(template.render(context))

            elif router == "dash-payments":
                payments_query = Payments.query()
                payments_list = payments_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/payment-requests.html')
                context = {'payments_list':payments_list}
                self.response.write(template.render(context))

            elif router == "dash-contacts":
                from contacts import ContactMessages
                contact_messages_query = ContactMessages.query()
                contact_messages_list = contact_messages_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/contact-messages.html')
                context = {'contact_messages_list':contact_messages_list}
                self.response.write(template.render(context))

            elif router == "dash-chat":

                chat_channels_query = Channel.query()
                chat_channels_list = chat_channels_query.fetch()

                if len(chat_channels_list) == 0:
                    this_channel = Channel()
                    this_channel.write_channelid(channelid=this_channel.create_channelid())
                    this_channel.set_channel_active(isactive=False) # true if there is someone chatting at the channel now
                    this_channel.put()

                    chat_channels_query = Channel.query()
                    chat_channels_list = chat_channels_query.fetch()



                chat_query = Chat.query()
                chat_list = chat_query.fetch()

                messages_query = Messages.query()
                messages_list = messages_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/chat.html')
                context = {'chat_channels_list': chat_channels_list,'chat_list':chat_list}
                self.response.write(template.render(context))

            elif router == "dash-products":
                products_query = Products.query()
                products_list = products_query.fetch()

                category_query = Category.query()
                category_list = category_query.fetch()


                template = template_env.get_template('templates/pages/dashboard/products.html')
                context = {'products_list':products_list,'category_list':category_list}
                self.response.write(template.render(context))


            elif router == "dash-category":
                category_query = Category.query()
                category_list = category_query.fetch()

                template = template_env.get_template('templates/pages/dashboard/categories.html')
                context = {'category_list':category_list}
                self.response.write(template.render(context))



        else:
            template = template_env.get_template('templates/pages/500.html')
            context = {}
            self.response.write(template.render(context))

    def post(self):

        if users.is_current_user_admin():

            router = self.request.get('route')
            id = self.request.get('id')

            if router == "contact":
                from contacts import ContactMessages
                message_query = ContactMessages.query(ContactMessages.messageid == id)
                this_message_list = message_query.fetch(limit=1)

                if len(this_message_list) > 0:
                    this_message = this_message_list[0]

                    template = template_env.get_template('templates/pages/dashboard/read-message.html')
                    context = {'this_message':this_message}
                    self.response.write(template.render(context))

            elif router == "dash-save-product":
                product_name = self.request.get('product-name')

                product_name = product_name.strip()
                product_name = product_name.lower()

                product_description = self.request.get('product-description')
                product_description = product_description.strip()

                product_image_file = self.request.get('product-image')
                product_image_url = self.request.get('product-image-url')

                product_category = self.request.get('product-category')

                product_price = self.request.get('product-price')
                product_price = float(product_price)

                product_cost = self.request.get('product-cost')
                product_cost = float(product_cost)

                product_uom = self.request.get('uom')

                logging.info(product_name)
                logging.info(product_description)
                logging.info(product_image_file)
                logging.info(product_image_url)
                logging.info(product_category)
                logging.info(product_price)
                logging.info(product_cost)
                logging.info(product_uom)


                product_request = Products.query(Products.product_name == product_name)
                this_products_list = product_request.fetch()

                if len(this_products_list) == 0:
                    this_product = Products()
                    this_product.write_product_code(product_code=this_product.create_product_code())
                    this_product.write_product_name(product_name=product_name)
                    this_product.write_product_description(product_description=product_description)
                    this_product.write_product_image_url(product_image_url=product_image_url)
                    this_product.write_product_category_code(category_code=product_category)
                    this_product.write_price_per_item(price_per_item=product_price)
                    this_product.write_cost_per_item(cost=product_cost)
                    this_product.write_product_uom(uom=product_uom)
                    this_product.put()
                    self.response.write('successfully added new product to your store')
                else:
                    self.response.write('cannot add this product as a product with a similar name already exist')

            elif router == "dash-save-category":
                category_name = self.request.get('category-name')
                category_name = category_name.strip()
                category_name = category_name.lower()

                category_decription = self.request.get('category-description')
                category_decription = category_decription.strip()

                image_url = self.request.get('image-url')

                logging.info(category_name)
                logging.info(category_decription)
                logging.info(image_url)


                category_request = Category.query(Category.category_name == category_name)
                this_category_list = category_request.fetch()

                if len(this_category_list) == 0:
                    this_category = Category()

                    this_category.write_category_code(category_code=this_category.create_category_id())
                    this_category.write_category_name(category_name=category_name)
                    this_category.write_category_description(category_description=category_decription)
                    this_category.write_image_url(image_url=image_url)
                    this_category.put()
                    self.response.write('successfully added a new product category to the store')
                else:
                    self.response.write('a category with a similar name already exists please add products')


            elif router == "load-this-category":
                id = self.request.get('id')

                category_query = Category.query(Category.category_code == id)
                category_list = category_query.fetch()

                if len(category_list) > 0:
                    this_category = category_list[0]

                    products_query = Products.query(Products.product_category_code == id)
                    products_list = products_query.fetch()

                    template = template_env.get_template('templates/pages/dashboard/category/thiscategory.html')
                    context = {'this_category':this_category,'products_list':products_list}
                    self.response.write(template.render(context))


            elif router == 'load-this-product':
                id = self.request.get('id')

                product_query = Products.query(Products.product_code == id)
                products_list = product_query.fetch()

                if len(products_list) > 0:
                    this_product = products_list[0]
                    template = template_env.get_template('templates/pages/dashboard/products/thisproduct.html')
                    context = {'this_product':this_product}
                    self.response.write(template.render(context))






class CartHandler(webapp2.RequestHandler):

    def get(self):
        pass

    def post(self):

        route = self.request.get('route')
        id = self.request.get('id')

        if route == 'cart':
            
            if ((id == 'checkout') or (id == 'maincheckout')):

                template = template_env.get_template('templates/pages/cart/cart-items.html')
                context = {}
                self.response.write(template.render(context))

        elif route == "load-physical-address":
            userid = self.request.get('userid')

            logging.info("Loading Delivery Address")

            physical_address_query = PhysicalAddress.query(PhysicalAddress.userid == userid)
            physical_address_list = physical_address_query.fetch()

            if len(physical_address_list) > 0:
                physical_address = physical_address_list[0]
            else:
                physical_address = PhysicalAddress()

            template = template_env.get_template('templates/pages/cart/delivery-address.html')
            context = {'delivery_address':physical_address}
            self.response.write(template.render(context))


        elif route == "load-postal-address":
            userid = self.request.get('userid')

            logging.info("loading postal address")

            postal_address_query = PostalAddress.query(PostalAddress.userid == userid)
            postal_address_list = postal_address_query.fetch()

            if len(postal_address_list) > 0:
                postal_address = postal_address_list[0]
            else:
                postal_address = PostalAddress()

            template = template_env.get_template('templates/pages/cart/postal-address.html')
            context = {'postal_address':postal_address}
            self.response.write(template.render(context))


        elif route == "company-physical-address":

            company_physical_address_request = Company_physical_address.query()
            company_physical_address_list = company_physical_address_request.fetch()

            if len(company_physical_address_list) > 0:
                company_physical_address = company_physical_address_list[0]
            else:
                company_physical_address = Company_physical_address()

            company_setup_request = CompanySetup.query()
            company_setup_list =company_setup_request.fetch()

            if len(company_setup_list) > 0:
                company_setup = company_setup_list[0]
            else:
                company_setup = CompanySetup()



            template = template_env.get_template('templates/pages/cart/company-physical.html')
            context = {'company_physical_address':company_physical_address,'company_setup':company_setup}
            self.response.write(template.render(context))



        elif route == "load-payment-options":
            userid = self.request.get('userid')

            logging.info("Loading payment options")

            payment_options_query = Payments.query(Payments.userid == userid)
            payment_options_list = payment_options_query.fetch()

            if len(payment_options_list) > 0:
                payment_options = payment_options_list[0]
            else:
                payment_options = Payments()

            template = template_env.get_template('templates/pages/addfunds.html')
            context = {'payment_options':payment_options}
            self.response.write(template.render(context))


        elif route == "load-project-art-drive":

            userid = self.request.get('userid')

            project_art_query = ProjectArt.query(ProjectArt.userid == userid)
            project_art_drive_list = project_art_query.fetch()

            template = template_env.get_template('templates/pages/drive/project-art.html')
            context = {'project_art_drive_list':project_art_drive_list}
            self.response.write(template.render(context))


        elif route == "load_user_delivery_settings":

            userid = self.request.get("userid")

            user_delivery_settings_request = Settings.query(Settings.userid == userid)
            user_delivery_settings_list = user_delivery_settings_request.fetch()

            if len(user_delivery_settings_list) > 0:
                user_delivery_settings = user_delivery_settings_list[0]
            else:
                user_delivery_settings = Settings()


            template = template_env.get_template('templates/pages/cart/delivery_settings.html')
            context = {'user_delivery_settings':user_delivery_settings}
            self.response.write(template.render(context))


        elif route == "load-company-account-details":

            template = template_env.get_template('templates/pages/cart/company_account.html')
            self.response.write(template.render())
        elif route == "select-bank":
            bank = self.request.get('bank')

            company_bank_account_query = Company_Account.query(Company_Account.bank_name == bank)
            company_bank_account_list = company_bank_account_query.fetch()

            if len(company_bank_account_list) > 0:
                company_bank_account = company_bank_account_list[0]
            else:
                company_bank_account = Company_Account()

            template = template_env.get_template('templates/pages/cart/bankaccount.html')
            context = {'company_bank_account':company_bank_account}
            self.response.write(template.render(context))




















app = webapp2.WSGIApplication([
    ('/dashboard.*', DashboardHandler),
    ('/cart.*', CartHandler),
    ('.*', MainHandler)
], debug=True)
