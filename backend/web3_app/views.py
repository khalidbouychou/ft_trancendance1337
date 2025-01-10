from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response




from web3 import Web3
import json
import os

# Create your views here.

caller = "0xF6d3ddbf8BC37BD01c292db9C65343a81202F12A"
private_key = "DF1F5281594CD457780BE2DE7CE0834CC15F230258CD17F99541DEEAFDAD9BFC"
contract=None
web3=None
contract_address = ""
abi=""

def index(request):
    """
    endpoint : /
    method : GET
    desc : establishes connection to the blockchain, calling this endpoint is optional
            as all other endpoints check for connection, and establish it if it isn't established already
    """
    global contract

    init_web3_connection()

    return HttpResponse(f"connection successfuly established to {contract_address}")

def init_web3_connection():
    global contract
    global contract_address
    global web3
    # Initialize endpoint URL
    node_url = "http://web3_app:7545"

    # Create the node connection
    web3 = Web3(Web3.HTTPProvider(node_url))

    with open("/volume/contractAddress.txt") as contract:
        contract_address = contract.read()

    with open("/volume/build/contracts/HelloWorld.json") as build_info:
        build_info = json.load(build_info)
        abi = build_info["abi"]

    contract = web3.eth.contract(address=contract_address, abi=build_info["abi"])

def get_scores(request):
    print('u called me -------')
    global contract
    print('contract:', contract)
    if contract == None:
        print('its totaly ok')
        init_web3_connection()
        print('still no problem')
    print('a wall of rocks')
    try:
        scores = contract.functions.get_scores.call()
        print('everything is way perfect')
        return HttpResponse(f"{scores}")
    except:
        print('something went wrong')
        return HttpResponse("scores array is still empty!")

def get_scores_num(request):
    global contract
    if contract == None:
        init_web3_connection()

    scores_num = contract.functions.get_scores_num.call()
    return HttpResponse(f"{scores_num}")


def add_score(request):
    global contract
    if contract == None:
        init_web3_connection()

    # if request.method != "POST":
    #     response = {'status': 'error', 'message': 'wrong http request method'}
    #     return JsonResponse(response)

    try:
        score = request.GET.get('score', None)
        if score:
            response = {'status': 'success', 'score': score}
            send_add_score_transaction(score)
        else:
            response = {'status': 'error', 'message': 'Parameter "score" not provided'}
    except:
            response = {'status': 'error', 'message': 'exception!!'}

    return JsonResponse(response)


def send_add_score_transaction(score: str):
    global web3
    # Call a non-pure function that changes state
    nonce = web3.eth.get_transaction_count(caller)
    gas_price = web3.eth.gas_price  # You can set a custom gas price

    # Preparing the transaction
    transaction = contract.functions.add_score(score).build_transaction({
        'chainId': web3.eth.chain_id,
        'gas': 2000000,
        'gasPrice': web3.eth.gas_price,
        'nonce': nonce,
    })

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key)

    # Send the transaction
    txn_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

    # Wait for the transaction to be mined
    txn_receipt = web3.eth.wait_for_transaction_receipt(txn_hash)
    #print(txn_receipt)


def get_first_score(request):
    global contract
    if contract == None:
        init_web3_connection()

    try:
        first = contract.functions.get_first_score.call()
        return HttpResponse(f"first score = {first}")
    except:
        return HttpResponse("scores array is still empty!")

def get_last_score(request):
    global contract
    if contract == None:
        init_web3_connection()

    try:
        last = contract.functions.get_last_score.call()
        return HttpResponse(f"last score = {last}")
    except:
        return HttpResponse("scores array is still empty!")

# @api_view(['GET', 'POST'])
# def hello_world(request):
#     global contract
#     if contract == None:
#         init_web3_connection()

#     if request.method != "POST":
#         response = {'status': 'error', 'message': 'wrong http request method'}
#         return Response(response)

#     try:
#         score = request.data.get('score', None)
#         if score:
#             response = {'status': 'success', 'score': score}
#             send_add_score_transaction(score)
#         else:
#             response = {'status': 'error', 'message': 'Parameter "score" not provided'}

#         return Response(response)

#     except Exception as e:
#         print(e)
#         return HttpResponse(f"error : {e}")
