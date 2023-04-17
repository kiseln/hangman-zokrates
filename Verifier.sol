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
        vk.alpha = Pairing.G1Point(uint256(0x0a245c1070a528fac8e679d9efaf118fbe2efeb26492f2ddeb518d092071f75d), uint256(0x1b420ec137c8eedf59334f70e48a0a10a51d4eec266e177e7acdd20cd5d03959));
        vk.beta = Pairing.G2Point([uint256(0x15ad43bb9aa163b0619207cea5f4b5e49ee1f1a55fd758c294e7ec67479ffb53), uint256(0x22b17b2006c1b0ecd37b86632706eb816a07044b4b5bcd57901769bab8bb0d30)], [uint256(0x0c94a9a5c44bc437150e4de66cba9e60b34b68bc0b0a34feabc5ec542e46b70e), uint256(0x2a064bb475da55f3dc009aa19e54a8aeb4a7f85d7089398af9eaf29574be935c)]);
        vk.gamma = Pairing.G2Point([uint256(0x256e1dd05b61097083807d48c3859c0b4d1078cce0d6cc6ee0be92a42d4b5e35), uint256(0x20707b791c8226c523a9135623fa7fe8a893150fec7deb3bb8d50e7e73baf91e)], [uint256(0x051575c976cad63a964f3a99b55fb553397916a494d203c13484a8b3280aad9b), uint256(0x2f181af1378be74cb2be23d3b56ccac48f20d1f721ae2a98dfb335293e203c7c)]);
        vk.delta = Pairing.G2Point([uint256(0x12c12080bb7cfacfb9f0ac7b7951c2d3a10e4c851423a7ec83e955f1227e3440), uint256(0x1d3b37eb402c45eada828f368f3b9cea11e79baee4280f90767b192ebb9f6619)], [uint256(0x17c9735dfabdd5c0dab448922da94ba25f51aa0c440c93746de155b458248e00), uint256(0x1ab3e303676ba1e91c3b8fb4e6122ea62c821454b7bdeb761fd50430c9cde4dc)]);
        vk.gamma_abc = new Pairing.G1Point[](26);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x250a4ec7ca16c71fd36430ff2db4e4a580474f0a50f8eac5cf588d2dd59cfa0c), uint256(0x0c56f8758a85ac4843f589bedccf3618e07b6f86582a9f61ea4113ba99050ceb));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x21bbca83a3af51ed249389166f7402e6748e37c03649837915051e18ada7b6d1), uint256(0x12f951244870120778a0852fd7bdf4ea8796504784882c2e5b7ccf55c279e968));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x01bc9d936e9e3317cbb495de393d4d4f6843b785f90fd1ce5cd917e8625ecc55), uint256(0x0d44c1fa463ef5bc70243e6dcab5750e35db1270c49eaff2d79a9cd29653076f));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x2c1c650128b7df343b54f821a8c0e49a4888a706d00faaf68cf1088fb8dc7e5d), uint256(0x2f33a6bd861e80de0e8925e2b77fd8fca3621cc56bba5d4e01d0bc235497a5f2));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x24a6025f272658ecd364e20f3fe9b9b9ac0d49852a4f5cf11e58d240c5a659f8), uint256(0x05395b9002db3afc322b6dc65baa9054c07a53231f02554097d1a6615e9548ec));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x1974d2871f86ddba6760f0b3db65cff7984b033b3e553e331dd073874fa08762), uint256(0x251697b1d40c9c46babc91c9e4bf074b23d19797a16977fc9ead7e84fd50d0e9));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x2eebf97fb0a1f655de3e8a84bea1941e1324b79248b9b3c91c08b14fe3044b0e), uint256(0x022b350d36c2380810e86a1b0c80c7daf710c62365d5372eeefed95130ea0c54));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x1b22f0b4871701261a628f9559e520df77b35fe31855c4be022f31bfb584b4aa), uint256(0x0548a77cb9b02e433b1906bb950dd0061bd85aba90ad295bf85525097cef31cc));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x17cd61c5aa897d67ee6b7e1dff3e7b22132593d2c35b63d1460620ef06d3487b), uint256(0x0eecc2390b4ab6f905c662452f629f5458e49f1d54ee4b3a8fc4a75c3d322209));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x1ab37f030845d0f8fbcbbb60bb1d104f1d07624781e24ab0f91772598f1b2b09), uint256(0x0e8cb483966315a6a39fb1764525e592cc04e70201ef2149ebbca5c23dbd75b0));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x16c5aca55c6f1eebbb2cddb4705ad5c576aac4cb5d8bcfef8da0d408e094589f), uint256(0x003071a64d1fc04fe38b0a9b40c059b0feea04a7e87809b0375fdc51cf543237));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x14b736147699e72f8748c8b50da3b5e49030e09dfb84c4f2df6b745b39f10734), uint256(0x2c77152083e18aab24e76dd9bd95c77f295bdaf8d2ed0b81710885d117847e5c));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x207c12f64c4018048d3f8873b1fde9b1181c0a395c03d5388376ebd47bb2e7c1), uint256(0x2a320694d5f486adae6f5d2c943f21ca37624a9275aa4b78c8d6754043ee5419));
        vk.gamma_abc[13] = Pairing.G1Point(uint256(0x2ca6f0a0f74cc5bb0ae7eabd0c811aef3121d9740218a2f09a3b8f318be930ba), uint256(0x080554f78d8ac61567e059f85236a155f8b78ac2775d6ecdbc2baff60a9cc2da));
        vk.gamma_abc[14] = Pairing.G1Point(uint256(0x2cbc8cfd9800481184e6b39a1a9dbb4a95ac56bd8d35768fe8da3f8d178d3b95), uint256(0x0c2042ec85fdfab29abbfca91b238ecec15eb4c703baec4427aac65e68b21c8c));
        vk.gamma_abc[15] = Pairing.G1Point(uint256(0x002174caee1bfafc7670711dfdd4c0c73faa18506c3480e3fd518e6c14d771fc), uint256(0x21de2fcbcc02deb97cafb0d57153c543fe1350e46c2f21b9ab8524856f71f7ba));
        vk.gamma_abc[16] = Pairing.G1Point(uint256(0x06919895d42cf4f5d6c2e441d0eaf6e3fc75a58975e3bb0e267f405f40dc4069), uint256(0x27903cc161fa5aaa3e0c12efeec0ada62707cc7034c8c92ac86558b4c03aff5f));
        vk.gamma_abc[17] = Pairing.G1Point(uint256(0x26bff8bea81a49d90803f12f9652c7b6968809e9177814f474bd5866b429bdae), uint256(0x058109a00f39563193e88ff7c2881bf3a3a7f089ef4716de20c504585ee4fbaa));
        vk.gamma_abc[18] = Pairing.G1Point(uint256(0x201db31e60c5ef159527398fe516e5ee103c1c5336962d052fe20a435b96dc77), uint256(0x0826138bd1dc1e4f071ae376249f54018787c7eb1f16061eb11a5dfe15e69df9));
        vk.gamma_abc[19] = Pairing.G1Point(uint256(0x18552be51eb9c61eb893eeb87226635fac6c04c2a4e21a70823a61e7d8ed8193), uint256(0x20f61610d3846b01b2b7055a23c4f2963cd8188d0df162870533833d18809bc8));
        vk.gamma_abc[20] = Pairing.G1Point(uint256(0x155725dfcdc454c1fd7df916cea58cd1f4d30725e88f9926c2a52910f1523fa5), uint256(0x02793e5993a824996776aa3673d644f99d2df2a809a90377e89f907fe3ef3df9));
        vk.gamma_abc[21] = Pairing.G1Point(uint256(0x1422d6deea477fb1f25fa4313804e7dbacda520984e701d6ed8df15a0f4fa99a), uint256(0x28f3711cd81baef430a2eb7e0ec655e9481b654dcfbe4a9a3dcfe35a5686d987));
        vk.gamma_abc[22] = Pairing.G1Point(uint256(0x04600ef910fa5779e569c066e6e3960e3ea798a6e94cf5bdc7634a9d6dc45101), uint256(0x2fd99cd1061ffed3571ea81a0cd66838808bdffeba2e6852b2385654fa716ffd));
        vk.gamma_abc[23] = Pairing.G1Point(uint256(0x16b2122cd97b8a14694741e2ff65a58b8da500b8132b30ac0103c0aae10c6995), uint256(0x0a8d5906f25311ad70b777ff1402e13241a441527f4f79bebdcd661679571bea));
        vk.gamma_abc[24] = Pairing.G1Point(uint256(0x0d430fb86764a6c42121180f6324f2ff7021a1102ddfe21ec446fc85975f1ec2), uint256(0x1e8ea8d954e073d4811c0080507c5f1c2b4816bda940acca0863bc418b146b92));
        vk.gamma_abc[25] = Pairing.G1Point(uint256(0x1a041f01f2bff8e94be72a27e5265ffeed9d640be3253459712a63d953248465), uint256(0x1e4477667df4c556102b6c80e686d1793b7473b47b529412cb7f1bb83f8434e7));
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
