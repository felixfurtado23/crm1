"""
URL configuration for testcm project.

The `urlpatterns` list routes URLs to  For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from merzaai.views import * 

urlpatterns = [
    path('api/leads/', leads_api, name='leads-api'),
    path('api/edit/', edit_api, name='edit-api'),
    path('api/leads/add/', add_lead_api, name='add-lead-api'),
    path('api/leads/<int:lead_id>/convert/', convert_lead_to_customer, name='convert_lead_to_customer'),
    path('api/leads/<int:lead_id>/delete/', delete_lead_api, name='delete-lead-api'),
    path('api/customers/', customers_api, name='leads-api'),
    path('api/customers/edit/', edit_customer_api, name='edit-customer-api'),
    path('api/customers/add/', add_customer_api, name='add-customer-api'),
    path('api/customers/<int:customer_id>/delete/', delete_customer_api, name='delete-customer-api'),
    path('api/invoices/', invoices_api, name='invoices-api'),
    path('api/invoices/add/', add_invoice_api, name='add-invoice-api'),
    path('api/invoices/edit/', edit_invoice_api, name='edit-invoice-api'),
    path('api/invoices/<int:invoice_id>/delete/', delete_invoice_api, name='delete-invoice-api'),
    path('api/invoices/<int:invoice_id>/mark-sent/', mark_invoice_sent, name='mark_invoice_sent'),
    path('api/invoices/<int:invoice_id>/mark-paid/', mark_invoice_paid_api, name='mark-invoice-paid-api'),
    path('api/invoices/summary/', invoice_summary_api, name='invoice_summary'),
    
    # Payments URLs
    path('api/payments/', payments_api, name='payments-api'),
    path('api/payments/add/', add_payment_api, name='add-payment-api'),

    path('api/dashboard/metrics/', dashboard_metrics_api, name='dashboard_metrics'),

]
