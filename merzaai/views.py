from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import json
import os
from datetime import datetime

@api_view(['GET'])
def leads_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'leads.json')
    with open(file_path, 'r') as f:
        data = json.load(f)
    leads = data.get('leads', [])
    return Response(leads)


@api_view(['POST'])
def add_lead_api(request):
    print("Received lead data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'leads.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        leads = data.get('leads', [])
        
        # Generate new ID
        new_id = max([lead.get('id', 0) for lead in leads], default=0) + 1
        
        # Create new lead
        new_lead = {
            "id": new_id,
            "name": request.data.get('name'),
            "company": request.data.get('company'),
            "title": request.data.get('title', ''),
            "email": request.data.get('email', ''),
            "phone": request.data.get('phone', ''),
            "address": request.data.get('address', ''),
            "source": request.data.get('source', ''),
            "status": request.data.get('status', 'new'),
            "addedDate": request.data.get('addedDate', ''),
            "lastContact": request.data.get('lastContact', ''),
            "industry": request.data.get('industry', ''),
            "annualRevenue": request.data.get('annualRevenue', ''),
            "notes": request.data.get('notes', '')
        }
        
        leads.append(new_lead)
        data['leads'] = leads
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Lead added successfully!")
        return Response(new_lead, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['POST'])
def convert_lead_to_customer(request, lead_id):
    try:
        # Read leads.json
        leads_path = os.path.join(settings.JSON_DIR, 'leads.json')
        with open(leads_path, 'r') as f:
            leads_data = json.load(f)
        
        # Find the lead
        lead = None
        for l in leads_data['leads']:
            if l['id'] == lead_id:
                lead = l
                break
        
        if not lead:
            return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Read customers.json
        customers_path = os.path.join(settings.JSON_DIR, 'customers.json')
        with open(customers_path, 'r') as f:
            customers_data = json.load(f)
        
        # Generate new customer ID
        customers = customers_data.get('customers', [])
        new_id = max([c.get('id', 0) for c in customers], default=0) + 1
        
        # Create customer from lead
        new_customer = {
            "id": new_id,
            "name": lead['name'],
            "company": lead['company'],
            "title": lead.get('title', ''),
            "email": lead.get('email', ''),
            "phone": lead.get('phone', ''),
            "address": lead.get('address', ''),
            "addedDate": "November 10, 2025",  # Simple string instead of datetime
            "notes": f"Converted from lead. Original notes: {lead.get('notes', '')}",
            "totalInvoices": 0,
            "totalAmount": 0,
            "invoices": []
        }
        
        # Add to customers
        customers.append(new_customer)
        customers_data['customers'] = customers
        
        # Update lead status to "won"
        for l in leads_data['leads']:
            if l['id'] == lead_id:
                l['status'] = 'won'
                break
        
        # Save both files
        with open(customers_path, 'w') as f:
            json.dump(customers_data, f, indent=2)
        
        with open(leads_path, 'w') as f:
            json.dump(leads_data, f, indent=2)
        
        return Response(new_customer, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error in convert_lead_to_customer:", str(e))  # Add this for debugging
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['DELETE'])
def delete_lead_api(request, lead_id):
    print(f"Deleting lead ID: {lead_id}")
    file_path = os.path.join(settings.JSON_DIR, 'leads.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        leads = data.get('leads', [])
        initial_count = len(leads)
        
        # Filter out the lead to delete
        leads = [lead for lead in leads if lead['id'] != lead_id]
        
        if len(leads) == initial_count:
            return Response({"error": "Lead not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data['leads'] = leads
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Lead deleted successfully!")
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def edit_api(request):
    print("Received data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'leads.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        leads = data.get('leads', [])
        
        lead_id = request.data.get('id')
        for lead in leads:
            if lead['id'] == lead_id:
                lead.update(request.data)
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Lead updated successfully!")
        return Response(request.data)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def customers_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'customers.json')
    with open(file_path, 'r') as f:
        data = json.load(f)

    customers = data.get('customers', [])
    return Response(customers)

@api_view(['POST'])
def edit_customer_api(request):
    print("Received customer data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'customers.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        customers = data.get('customers', [])
        
        customer_id = request.data.get('id')
        for customer in customers:
            if customer['id'] == customer_id:
                customer.update(request.data)
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Customer updated successfully!")
        return Response(request.data)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    

@api_view(['POST'])
def add_customer_api(request):
    print("Received customer data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'customers.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        customers = data.get('customers', [])
        
        new_id = max([customer.get('id', 0) for customer in customers], default=0) + 1
        
        new_customer = {
            "id": new_id,
            "name": request.data.get('name'),
            "company": request.data.get('company'),
            "title": request.data.get('title', ''),
            "email": request.data.get('email', ''),
            "phone": request.data.get('phone', ''),
            "address": request.data.get('address', ''),
            "addedDate": request.data.get('addedDate', ''),
            "notes": request.data.get('notes', ''),
            "totalInvoices": request.data.get('totalInvoices', 0),
            "totalAmount": request.data.get('totalAmount', 0),
            "invoices": request.data.get('invoices', [])
        }
        
        customers.append(new_customer)
        data['customers'] = customers
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Customer added successfully!")
        return Response(new_customer, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['DELETE'])
def delete_customer_api(request, customer_id):
    print(f"Deleting customer ID: {customer_id}")
    file_path = os.path.join(settings.JSON_DIR, 'customers.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        customers = data.get('customers', [])
        initial_count = len(customers)
        
        # Filter out the customer to delete
        customers = [customer for customer in customers if customer['id'] != customer_id]
        
        if len(customers) == initial_count:
            return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data['customers'] = customers
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Customer deleted successfully!")
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def invoices_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'invoices.json')
    with open(file_path, 'r') as f:
        data = json.load(f)

    invoices = data.get('invoices', [])
    return Response(invoices)

@api_view(['POST'])
def add_invoice_api(request):
    print("Received invoice data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'invoices.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        
        new_id = max([invoice.get('id', 0) for invoice in invoices], default=0) + 1
        invoice_count = len(invoices) + 1
        invoice_number = f"INV-{invoice_count:04d}"
        
        customer_id = request.data.get('customer_id')
        customer_name = request.data.get('customer_name', '')
        customer_company = request.data.get('customer_company', '')
        
        # If it's a regular customer invoice, get customer details
        if customer_id and customer_id != 'custom':
            try:
                customers_path = os.path.join(settings.JSON_DIR, 'customers.json')
                with open(customers_path, 'r') as f:
                    customers_data = json.load(f)
                
                customers = customers_data.get('customers', [])
                for customer in customers:
                    if customer['id'] == customer_id:
                        customer_name = f"{customer['company']} - {customer['name']}"
                        customer_company = customer['company']
                        break
            except Exception as e:
                print("Error fetching customer details:", str(e))
        
        # Create new invoice
        new_invoice = {
            "id": new_id,
            "number": invoice_number,
            "customer": customer_name,
            "customer_id": customer_id if customer_id != 'custom' else None,
            "customer_company": customer_company,
            "date": request.data.get('date'),
            "dueDate": request.data.get('due_date') or request.data.get('dueDate'),
            "status": request.data.get('status', 'draft'),
            "items": request.data.get('items', []),
            "subtotal": request.data.get('subtotal', 0),
            "vat": request.data.get('vat', 0),
            "total": request.data.get('total', 0)
        }
        print(new_invoice,"fellix")
        invoices.append(new_invoice)
        data['invoices'] = invoices
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Update customer record if it's a regular customer
        if customer_id and customer_id != 'custom':
            try:
                customers_path = os.path.join(settings.JSON_DIR, 'customers.json')
                with open(customers_path, 'r') as f:
                    customers_data = json.load(f)
                
                customers = customers_data.get('customers', [])
                for customer in customers:
                    if customer['id'] == customer_id:
                        # Add invoice to customer's invoices array
                        customer_invoice = {
                            "number": invoice_number,
                            "date": request.data.get('date'),
                            "amount": request.data.get('total', 0),
                            "status": request.data.get('status', 'draft')
                        }
                        
                        if 'invoices' not in customer:
                            customer['invoices'] = []
                        
                        customer['invoices'].append(customer_invoice)
                        
                        # Update customer totals
                        customer['totalInvoices'] = len(customer['invoices'])
                        customer['totalAmount'] = sum(inv.get('amount', 0) for inv in customer['invoices'])
                        
                        break
                
                # Save updated customers data
                with open(customers_path, 'w') as f:
                    json.dump(customers_data, f, indent=2)
                
                print("Customer record updated successfully!")
                
            except Exception as e:
                print("Error updating customer record:", str(e))
        
        print("Invoice added successfully!")
        return Response(new_invoice, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@api_view(['POST'])
def add_custom_invoice_api(request):
    print("Received custom invoice data:", request.data)
    invoices_path = os.path.join(settings.JSON_DIR, 'invoices.json')
    customers_path = os.path.join(settings.JSON_DIR, 'customers.json')

    try:
        # Read invoices data
        with open(invoices_path, 'r') as f:
            invoices_data = json.load(f)
        
        invoices = invoices_data.get('invoices', [])
        
        new_id = max([invoice.get('id', 0) for invoice in invoices], default=0) + 1
        invoice_count = len(invoices) + 1
        invoice_number = f"INV-CUST-{invoice_count:04d}"
        
        custom_details = request.data.get('custom_details', {})
        add_as_customer = request.data.get('add_as_customer', True)  # Default to True for "Save Customer"
        
        customer_name = f"{custom_details.get('companyName', '')} - {custom_details.get('contactPerson', '')}"
        
        # Create new invoice
        new_invoice = {
            "id": new_id,
            "number": invoice_number,
            "customer": customer_name,
            "customer_id": None,  # No customer ID for custom invoices
            "customer_company": custom_details.get('companyName', ''),
            "custom_details": custom_details,
            "date": request.data.get('date'),
            "dueDate": request.data.get('due_date') or request.data.get('dueDate'),

            "status": request.data.get('status', 'draft'),
            "items": request.data.get('items', []),
            "subtotal": request.data.get('subtotal', 0),
            "vat": request.data.get('vat', 0),
            "total": request.data.get('total', 0)
        }
        print(new_invoice)
        invoices.append(new_invoice)
        invoices_data['invoices'] = invoices
        
        # Save invoice
        with open(invoices_path, 'w') as f:
            json.dump(invoices_data, f, indent=2)
        
        # Add as customer (always True for "Save Customer" button)
        if add_as_customer:
            try:
                with open(customers_path, 'r') as f:
                    customers_data = json.load(f)
                
                customers = customers_data.get('customers', [])
                new_customer_id = max([c.get('id', 0) for c in customers], default=0) + 1
                
                new_customer = {
                    "id": new_customer_id,
                    "name": custom_details.get('contactPerson', ''),
                    "company": custom_details.get('companyName', ''),
                    "title": custom_details.get('title', ''), 
                    "email": custom_details.get('email', ''),
                    "phone": custom_details.get('phone', ''),
                    "address": custom_details.get('address', ''),
                    "trn": custom_details.get('trnNumber', ''),
                    "addedDate": datetime.now().strftime("%B %d, %Y"),
                    "notes": "Added from custom invoice",
                    "totalInvoices": 1,
                    "totalAmount": request.data.get('total', 0),
                    "invoices": [{
                        "number": invoice_number,
                        "date": request.data.get('date'),
                        "amount": request.data.get('total', 0),
                        "status": request.data.get('status', 'draft')
                    }]
                }
                
                customers.append(new_customer)
                customers_data['customers'] = customers
                
                with open(customers_path, 'w') as f:
                    json.dump(customers_data, f, indent=2)
                
                print("Custom invoice customer added successfully!")
                
            except Exception as e:
                print("Error adding custom invoice customer:", str(e))
        
        print("Custom invoice added successfully!")
        return Response(new_invoice, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def edit_invoice_api(request):
    print("Received invoice data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'invoices.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        
        invoice_id = request.data.get('id')
        for invoice in invoices:
            if invoice['id'] == invoice_id:
                invoice.update({
                    "customer": request.data.get('customer', invoice['customer']),
                    "date": request.data.get('date', invoice['date']),
                    "dueDate": request.data.get('dueDate', invoice['dueDate']),
                    "status": request.data.get('status', invoice['status']),
                    "items": request.data.get('items', invoice['items']),
                    "subtotal": request.data.get('subtotal', invoice['subtotal']),
                    "vat": request.data.get('vat', invoice['vat']),
                    "total": request.data.get('total', invoice['total'])
                })
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Invoice updated successfully!")
        return Response(request.data)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_invoice_api(request, invoice_id):
    print(f"Deleting invoice ID: {invoice_id}")
    file_path = os.path.join(settings.JSON_DIR, 'invoices.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        initial_count = len(invoices)
        
        # Filter out the invoice to delete
        invoices = [invoice for invoice in invoices if invoice['id'] != invoice_id]
        
        if len(invoices) == initial_count:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data['invoices'] = invoices
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Invoice deleted successfully!")
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def mark_invoice_sent(request, invoice_id):
    try:
        file_path = os.path.join(settings.JSON_DIR, 'invoices.json')
        
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        
        for invoice in invoices:
            if invoice['id'] == invoice_id:
                invoice['status'] = 'sent'
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return Response({"message": "Invoice marked as sent"})
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def invoice_summary_api(request):
    try:
        invoices_path = os.path.join(settings.JSON_DIR, 'invoices.json')
        
        with open(invoices_path, 'r') as f:
            invoices_data = json.load(f)
        
        invoices = invoices_data.get('invoices', [])
        
        # Total Sales - ALL invoices (not just MTD)
        total_sales = sum(
            float(invoice.get('total', 0) or 0)
            for invoice in invoices
        )
        
        # Total Receivables - all unpaid invoices
        total_receivables = sum(
            float(invoice.get('total', 0) or 0)
            for invoice in invoices
            if invoice.get('status') != 'paid'
        )
        
        # Total Cash Collected - ALL paid invoices (not just MTD)
        total_cash_collected = sum(
            float(invoice.get('total', 0) or 0)
            for invoice in invoices
            if invoice.get('status') == 'paid'
        )
        
        summary_data = {
            'totalSales': round(total_sales, 2),
            'totalReceivables': round(total_receivables, 2),
            'totalCashCollected': round(total_cash_collected, 2)
        }
        
        return Response(summary_data)
        
    except Exception as e:
        print("Error in invoice summary:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def mark_invoice_paid(request, invoice_id):
    try:
        file_path = os.path.join(settings.JSON_DIR, 'invoices.json')
        
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        
        for invoice in invoices:
            if invoice['id'] == invoice_id:
                invoice['status'] = 'paid'
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return Response({"message": "Invoice marked as paid"})
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def mark_invoice_paid_api(request, invoice_id):
    print(f"Marking invoice {invoice_id} as paid")
    file_path = os.path.join(settings.JSON_DIR, 'invoices.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        invoices = data.get('invoices', [])
        
        for invoice in invoices:
            if invoice['id'] == invoice_id:
                invoice['status'] = 'paid'
                break
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Invoice marked as paid successfully!")
        return Response({"message": "Invoice marked as paid"})
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Payments APIs
@api_view(['GET'])
def payments_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'payments.json')
    with open(file_path, 'r') as f:
        data = json.load(f)

    payments = data.get('payments', [])
    return Response(payments)

@api_view(['POST'])
def add_payment_api(request):
    print("Received payment data:", request.data)
    file_path = os.path.join(settings.JSON_DIR, 'payments.json')

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        payments = data.get('payments', [])
        
        # Generate new ID
        new_id = max([payment.get('id', 0) for payment in payments], default=0) + 1
        
        # Create new payment
        new_payment = {
            "id": new_id,
            "invoice_id": request.data.get('invoice_id'),
            "invoice_number": request.data.get('invoice_number'),
            "customer": request.data.get('customer'),
            "date": request.data.get('date'),
            "amount": request.data.get('amount'),
            "method": request.data.get('method', 'bank_transfer'),
            "reference": request.data.get('reference', '')
        }
        
        payments.append(new_payment)
        data['payments'] = payments
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        # Update invoice status to paid
        invoices_path = os.path.join(settings.JSON_DIR, 'invoices.json')
        with open(invoices_path, 'r') as f:
            invoices_data = json.load(f)
        
        invoices = invoices_data.get('invoices', [])
        for invoice in invoices:
            if invoice['id'] == request.data.get('invoice_id'):
                invoice['status'] = 'paid'
                break
        
        with open(invoices_path, 'w') as f:
            json.dump(invoices_data, f, indent=2)
        
        print("Payment added and invoice updated successfully!")
        return Response(new_payment, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print("Error:", str(e))
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
def chart_of_accounts_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'chart_of_accounts.json')
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        accounts = data.get('COA', [])
        # Add IDs if not present
        for index, account in enumerate(accounts, 1):
            if 'id' not in account:
                account['id'] = index
        return Response(accounts)
    except FileNotFoundError:
        return Response([], status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def add_account_api(request):
    file_path = os.path.join(settings.JSON_DIR, 'chart_of_accounts.json')
    try:
        # Try to read existing file
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
        except FileNotFoundError:
            data = {"COA": []}
        
        accounts = data.get('COA', [])
        
        # Convert vatApplicable to string for consistency
        vat_applicable = "Yes" if request.data.get('vatApplicable') else "No"
        
        new_account = {
            "id": len(accounts) + 1,
            "accountCode": request.data.get('accountCode'),
            "accountName": request.data.get('accountName'),
            "accountType": request.data.get('accountType'),
            "description": request.data.get('description', ''),
            "vatApplicable": vat_applicable
        }
        
        accounts.append(new_account)
        data['COA'] = accounts
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        return Response(new_account, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def edit_account_api(request, account_id):
    file_path = os.path.join(settings.JSON_DIR, 'chart_of_accounts.json')
    print(f"Editing account {account_id}")  # Debug line
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        accounts = data.get('COA', [])
        account_found = False
        
        for account in accounts:
            if account.get('id') == account_id:
                # Convert vatApplicable to string for consistency
                vat_applicable = "Yes" if request.data.get('vatApplicable') else "No"
                
                account.update({
                    "accountCode": request.data.get('accountCode'),
                    "accountName": request.data.get('accountName'),
                    "accountType": request.data.get('accountType'),
                    "description": request.data.get('description', ''),
                    "vatApplicable": vat_applicable
                })
                account_found = True
                print(f"Account updated: {account}")  # Debug line
                break
        
        if not account_found:
            print(f"Account with ID {account_id} not found")  # Debug line
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print("Account file saved successfully")  # Debug line
        return Response({"message": "Account updated successfully"})
        
    except Exception as e:
        print(f"Error updating account: {str(e)}")  # Debug line
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_account_api(request, account_id):
    file_path = os.path.join(settings.JSON_DIR, 'chart_of_accounts.json')
    print(f"Deleting account {account_id}")  # Debug line
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        accounts = data.get('COA', [])
        initial_count = len(accounts)
        
        # Filter out the account to delete
        accounts = [acc for acc in accounts if acc.get('id') != account_id]
        
        if len(accounts) == initial_count:
            print(f"Account with ID {account_id} not found for deletion")  # Debug line
            return Response({"error": "Account not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data['COA'] = accounts
        
        with open(file_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Account {account_id} deleted successfully")  # Debug line
        return Response(status=status.HTTP_204_NO_CONTENT)
        
    except Exception as e:
        print(f"Error deleting account: {str(e)}")  # Debug line
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from datetime import datetime, timedelta

@api_view(['GET'])
def dashboard_metrics_api(request):
    try:
        # Read all data files
        leads_path = os.path.join(settings.JSON_DIR, 'leads.json')
        customers_path = os.path.join(settings.JSON_DIR, 'customers.json')
        invoices_path = os.path.join(settings.JSON_DIR, 'invoices.json')
        
        with open(leads_path, 'r') as f:
            leads_data = json.load(f)
        with open(customers_path, 'r') as f:
            customers_data = json.load(f)
        with open(invoices_path, 'r') as f:
            invoices_data = json.load(f)
        
        leads = leads_data.get('leads', [])
        customers = customers_data.get('customers', [])
        invoices = invoices_data.get('invoices', [])
        
        # Debug: Print invoice data to see what we have
        print("=== INVOICES DATA ===")
        for inv in invoices:
            print(f"Invoice {inv.get('number')}: Status={inv.get('status')}, Total={inv.get('total')}, Date={inv.get('date')}")
        
        # Calculate metrics - SIMPLIFIED VERSION
        total_leads = len(leads)
        active_customers = len(customers)
        
        # Outstanding invoices (all unpaid)
        outstanding_invoices = sum(
            float(invoice.get('total', 0) or 0) 
            for invoice in invoices 
            if invoice.get('status') != 'paid'
        )
        
        # Cash received - ALL paid invoices (remove date filter for now)
        cash_received = sum(
            float(invoice.get('total', 0) or 0)
            for invoice in invoices
            if invoice.get('status') == 'paid'
        )
        
        # Sales - ALL invoices
        total_sales = sum(
            float(invoice.get('total', 0) or 0)
            for invoice in invoices
        )
        
        # Recent leads (last 4)
        recent_leads = leads[-4:] if len(leads) > 4 else leads
        
        # Unpaid invoices
        unpaid_invoices = [inv for inv in invoices if inv.get('status') != 'paid'][-4:]
        
        # Quick stats
        conversion_rate = calculate_conversion_rate(leads)
        avg_invoice_value = calculate_avg_invoice_value(invoices)
        payment_cycle = 32  # Default value
        
        # Debug output
        print(f"Total paid invoices: {len([inv for inv in invoices if inv.get('status') == 'paid'])}")
        print(f"Cash received total: {cash_received}")
        
        response_data = {
            'metrics': {
                'totalLeads': total_leads,
                'activeCustomers': active_customers,
                'outstandingInvoices': round(outstanding_invoices, 2),
                'cashReceivedMTD': round(cash_received, 2),  # Using total cash for now
                'salesMTD': round(total_sales, 2),  # Using total sales for now
                'totalReceivables': round(outstanding_invoices, 2),
            },
            'trends': {
                'salesTrend': 12.5,  # Hardcoded for now
                'cashTrend': 15.2,   # Hardcoded for now
            },
            'recentLeads': recent_leads,
            'unpaidInvoices': unpaid_invoices,
            'quickStats': {
                'conversionRate': conversion_rate,
                'avgInvoiceValue': avg_invoice_value,
                'paymentCycle': payment_cycle
            },
            'charts': {
                'salesTrendData': [15000, 18000, 21000],  # Hardcoded for now
                'collectionTrendData': [12000, 15000, 18000]  # Hardcoded for now
            }
        }
        
        return Response(response_data)
        
    except Exception as e:
        print("Error in dashboard metrics:", str(e))
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Keep helper functions but simplify for now
def calculate_conversion_rate(leads):
    if not leads:
        return 0
    won_leads = len([lead for lead in leads if lead.get('status') == 'won'])
    return round((won_leads / len(leads)) * 100, 1)

def calculate_avg_invoice_value(invoices):
    if not invoices:
        return 0
    total = sum(float(inv.get('total', 0) or 0) for inv in invoices)
    return round(total / len(invoices), 2)


# Helper functions
def is_current_month(date_str):
    try:
        if not date_str:
            return False
        # Handle different date formats
        if '-' in date_str:
            invoice_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            invoice_date = datetime.strptime(date_str, '%B %d, %Y')
        
        current_date = datetime.now()
        return invoice_date.month == current_date.month and invoice_date.year == current_date.year
    except:
        return False

def calculate_previous_month_sales(invoices):
    current = datetime.now()
    prev_month = current.month - 1 if current.month > 1 else 12
    prev_year = current.year if current.month > 1 else current.year - 1
    
    return sum(
        float(invoice.get('total', 0))
        for invoice in invoices
        if is_specific_month(invoice.get('date', ''), prev_month, prev_year)
    )

def calculate_previous_month_cash(invoices):
    current = datetime.now()
    prev_month = current.month - 1 if current.month > 1 else 12
    prev_year = current.year if current.month > 1 else current.year - 1
    
    return sum(
        float(invoice.get('total', 0))
        for invoice in invoices
        if invoice.get('status') == 'paid' and is_specific_month(invoice.get('date', ''), prev_month, prev_year)
    )

def is_specific_month(date_str, month, year):
    try:
        if not date_str:
            return False
        if '-' in date_str:
            invoice_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            invoice_date = datetime.strptime(date_str, '%B %d, %Y')
        
        return invoice_date.month == month and invoice_date.year == year
    except:
        return False

def calculate_trend(current, previous):
    if previous == 0:
        return 0
    return round(((current - previous) / previous) * 100, 1)






def get_sales_trend_data(invoices):
    # Last 3 months sales data
    current = datetime.now()
    months_data = []
    
    for i in range(3):
        month = current.month - i
        year = current.year
        if month <= 0:
            month += 12
            year -= 1
        
        month_sales = sum(
            float(inv.get('total', 0))
            for inv in invoices
            if is_specific_month(inv.get('date', ''), month, year)
        )
        months_data.append(round(month_sales, 2))
    
    return list(reversed(months_data))  # Oldest to newest

def get_collection_trend_data(invoices):
    # Last 3 months collection data
    current = datetime.now()
    months_data = []
    
    for i in range(3):
        month = current.month - i
        year = current.year
        if month <= 0:
            month += 12
            year -= 1
        
        month_collections = sum(
            float(inv.get('total', 0))
            for inv in invoices
            if inv.get('status') == 'paid' and is_specific_month(inv.get('date', ''), month, year)
        )
        months_data.append(round(month_collections, 2))
    
    return list(reversed(months_data))