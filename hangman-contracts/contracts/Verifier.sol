// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.19;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

abstract contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x14dbfde8bfc66030ac47032c300e6c55e90b0b42b364123c80863333729cbd11), uint256(0x1c527811c449651cdf16a7301432196cc3cff7c2b00b144f2a174c18a490feca));
        vk.beta = Pairing.G2Point([uint256(0x29be935651a4cc6f0c25ce250c769e79523f9192fc3c90a92c1f1a5c7ab3f7ba), uint256(0x16ab502588922e75200eb823fd0426e279dd4b614865c2bc25496db9b8cb4a68)], [uint256(0x07298f94225ad330ee5c95770046f2c5928b18d33cb9c0e9ea84bd1f5e4a738e), uint256(0x01f473e183d30331c8437637b6a3ccc76877724d63e29a04009e16095fdc9bd8)]);
        vk.gamma = Pairing.G2Point([uint256(0x24480450e02ce5c5ef1bdf31e346a99e6221d042644992e057d54312fc5293fa), uint256(0x27972e44576ac22d5c9d1227cf84c8022264ff6f8549a3cb1d8a75ebbce21dc8)], [uint256(0x2877242b08d3e1bee83506cb16553e3340a3b59dc3a9b4339b8c969b24faa03d), uint256(0x0455d342b9aed2578eb113ddc29f60b388404d615a6abec11b5fc1a9c852ab4d)]);
        vk.delta = Pairing.G2Point([uint256(0x26fd7168afeec263adcb24a8cf05fa31f2aa85acb9249ddbb57714708da03b6a), uint256(0x0eb2f6ec2b0f262088729971c68d1bdceacd78d5a1bf634c598b45bb33d23db7)], [uint256(0x0f88eb675840da5333295fb1ef5f0c4b4aa6783269cdec29a715b0132accf5e6), uint256(0x275ac5e2b8bbbd0ad470a05be82eb68821f51e1177be06fe183465f5e8fb5689)]);
        vk.gamma_abc = new Pairing.G1Point[](26);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x2a72250a2f70b482c73e4fbf1c52cfcd13d60d62eb1995e74d30c005e5aa5fd6), uint256(0x26f29aaaf966878ff9b1566dd700d41cc77bd432fa618ab7e4d7ffda82b8281d));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x075747b466ee9f2b972b806136c6fe85cadaab18eda3a300f52ba95dbf05337d), uint256(0x280ff497ac045a306fc6fdd5adf4309c9b66ad9908a09b557971e5ec9d54b3cc));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x1eb923240f81c8871a5d92135f7ae9599ad77f3e197a76439f39db1019de66cb), uint256(0x1a70e2ca901145bf70501cafac4eb9e985f8779affa64621526d46143bf6f907));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x1c9eed8e1ff90793d84691f7a8864fff74e5d07d591ac0214e26080e97425308), uint256(0x07807ead78b69f6dbb3274ec4c1e0f781c92557a5f33fc03a8b19dc6189850a2));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x2091d0faed0cb9d9dc5615b504c677ff90bb1647eead4881f1ace7a713d188a3), uint256(0x03f30d8bcf268e54748c9e0cb6f7c3f9fea2ee5a60ca0a20f8c201dc6f012d3f));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x1b5ebb4d73798094006e1da60388aa9ef42c10f9313c0e93790e12a90737c620), uint256(0x25b71ae94cd020b7ede16347327dcb9bb5911b8166c90faf7b3554f1807e7c83));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x2c63391041d98077cabc03386df5ac16466858a6f045005c69acb5558ecf1eed), uint256(0x1a3caab0531daa0c7f29e9bbcb4980869bc3794f58d1ed8cdb55d838d253d55a));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x1ed7110b61e431b1d988139bb29cd77a1963df5d1c1a59f11cfa5f4fbfddc341), uint256(0x21be4e7466fd554748249f36b0d98d5b6309f8177898896e0a7b35ba4a68a05c));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x079936816cef95fd8553f2685ef0cbd6a7a079f0fcbe519f1579910719d99869), uint256(0x1d5511d4144699ee19b35055bd0d3aebcb4edb66477f4887ce0aa7b89646b4fd));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x061181e979841446a8358e0b608fd9fa1d3ea36e60d25ad7dba96635a114212c), uint256(0x13d129fd9ecf1279cde3ba7ede38ef948f3899ae32849fe0800c6f7626198c4d));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x1b53a36d3ec1e2be74bb5ce3a18c5c89d5e68c013dd12cfc13e27a86ae55f587), uint256(0x1a0f86ff646a1ee2db93c28fad185aa563a765c245dcfa4f71c21b701e7e3ede));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x03a7b2a7b1418603fba5af779f0ba7ab735f556e04de5c72161903e531f4da52), uint256(0x206d79f0b0584228b26f3dcd87eccb17b54461912bb94ef4c9d82d91404d62e2));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x0c480892c2d43705068f8a98478caaa5e494502fa93108226c009d12081397d0), uint256(0x0d7b3147cc9a89836909b1bcb0175498445414c5016dccbbc8d55381aa54626f));
        vk.gamma_abc[13] = Pairing.G1Point(uint256(0x0d255d16cba4e3825d9f29326e8fa23c35256791a0953ea90c5c28362c82c137), uint256(0x081d26b2e957ce5277b2085b15bb1e34764f12b5cf33220012a182b413199ccc));
        vk.gamma_abc[14] = Pairing.G1Point(uint256(0x0a34525fbdb874a93a9272188c12c88d4612660c58622da4f66990817b924d2c), uint256(0x0dcfdccec15fc49651def1d07a4a721b42b2c3ad9043556c4f853522086fa90d));
        vk.gamma_abc[15] = Pairing.G1Point(uint256(0x01c7f3ad0b290037ee3d7c44816c618d4b39e06889df70a0ad4efd13ad3bbb35), uint256(0x0b9ff7a38cf1c18b4228ac95030ed4e1fb895b65943b5c0810204ddeb40e9150));
        vk.gamma_abc[16] = Pairing.G1Point(uint256(0x2f071a443e36b26fb8aff13c1effacb5ce086b372cce77d99a8f5ba582bf3443), uint256(0x2cfa3efdfeb232b80ac8eb2302a1cb23655237696993e788045b7ca2ff3c1ff9));
        vk.gamma_abc[17] = Pairing.G1Point(uint256(0x22e5ecc8be4e3631953bbd2b0f58932903a5db617a207dd20243977bd8d4e2f8), uint256(0x2e9adf0520a2028377b58c62513afd0bd7b94ad12781cdc1eecc01449c6c08b2));
        vk.gamma_abc[18] = Pairing.G1Point(uint256(0x1ad87d9e89b22525323fcddfe1d4446fc49f42c8763e39ca37f7cc890c2d5c4d), uint256(0x24f3930752359df9d87ba41bae1a5e9adeb261c0c65bdc3bf721048ee39e5877));
        vk.gamma_abc[19] = Pairing.G1Point(uint256(0x1ada30f686023b865f7f308b938079d120343c8fe95cc6a4f81db378a34a4d0a), uint256(0x1fc3c34c203e14d538d5af46e025805e41a1fa0281518b85ec330a38c02eb44d));
        vk.gamma_abc[20] = Pairing.G1Point(uint256(0x004ef2b6c0984361eec47cde5840da1ef83b4c16e197c02e3701c7c1f9be3444), uint256(0x05e5c153abee13e9518302252099e72098177f04f0c76ba20c34e18c6b393e97));
        vk.gamma_abc[21] = Pairing.G1Point(uint256(0x1d5545ed7f78b4a6993608ee1262d138bdb670585a1e7bf3c3e485d70a70fd9b), uint256(0x2d14d2788d108aa937c0cd2fc821885a25f3527e14943b8d787d627e21ecbc65));
        vk.gamma_abc[22] = Pairing.G1Point(uint256(0x1856b54d9982494d04c18094ffb5c98d87393a82a144f1ed659ddfb619c3e99d), uint256(0x11000c4db053c51261df7a26796651238d8d1ff73c844a934980dec6c8612047));
        vk.gamma_abc[23] = Pairing.G1Point(uint256(0x1da3840d558baac3ab65b6906349be3d2c98136f35d502a4163b9f8c65529e16), uint256(0x102f89dfab8af451ef5c902ae2a11a201bf62595d2ebb340f22b278e2f7f8a05));
        vk.gamma_abc[24] = Pairing.G1Point(uint256(0x15a802b3af2c9eb905ab66897301ca357461e4439c55bb2da2e939e37781755b), uint256(0x0fcf5ab3e0143c3ca37ff1f4295e9fb4aff2f9ec2dc72e83de45e1c71957f50e));
        vk.gamma_abc[25] = Pairing.G1Point(uint256(0x1c00de5bda2d1c94d8f3036f5f66d6a474bc5e5a42cec9ffcb3740f37f431e77), uint256(0x02240d066e7bc362d24e113539e97a85e908f98473aecd0f3c7099cc95bb4ff1));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[25] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](25);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
