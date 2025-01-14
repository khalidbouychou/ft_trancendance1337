// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {

	string[] public scores;

	function get_scores() public view returns (string[] memory){
		return scores;
	}

	function get_first_score() public view returns (string memory){
		uint arr_len = scores.length;
		require(arr_len > 0, "there are no scores yet");
		return scores[0];
	}

	function get_scores_num() public view returns (uint){
		return scores.length;
	}

	function get_last_score() public view returns (string memory){
		uint arr_len = scores.length;
		require(arr_len > 0, "there are no scores yet");
		return scores[arr_len - 1];
	}

	function add_score(string memory score) public{
		scores.push(score);
	}
}
