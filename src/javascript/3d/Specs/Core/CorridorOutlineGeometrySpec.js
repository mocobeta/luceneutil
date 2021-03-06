/*global defineSuite*/
defineSuite([
        'Core/CorridorOutlineGeometry',
        'Core/Cartesian3',
        'Core/CornerType',
        'Core/Ellipsoid',
        'Specs/createPackableSpecs'
    ], function(
        CorridorOutlineGeometry,
        Cartesian3,
        CornerType,
        Ellipsoid,
        createPackableSpecs) {
    "use strict";
    /*global jasmine,describe,xdescribe,it,xit,expect,beforeEach,afterEach,beforeAll,afterAll,spyOn*/

    it('throws without positions', function() {
        expect(function() {
            return new CorridorOutlineGeometry({});
        }).toThrowDeveloperError();
    });

    it('throws without width', function() {
        expect(function() {
            return new CorridorOutlineGeometry({
                positions: [new Cartesian3()]
            });
        }).toThrowDeveloperError();
    });

    it('createGeometry returns undefined without 2 unique positions', function() {
        var geometry = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                90.0, -30.0,
                90.0, -30.0
            ]),
            width: 10000
        }));
        expect(geometry).not.toBeDefined();
    });

    it('computes positions', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                90.0, -30.0,
                90.0, -35.0
            ]),
            cornerType: CornerType.MITERED,
            width : 30000
        }));

        expect(m.attributes.position.values.length).toEqual(3 * 12);
        expect(m.indices.length).toEqual(2 * 12);
    });

    it('computes positions extruded', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                 90.0, -30.0,
                 90.0, -35.0
            ]),
            cornerType: CornerType.MITERED,
            width : 30000,
            extrudedHeight: 30000
        }));

        expect(m.attributes.position.values.length).toEqual(3 * 24);
        expect(m.indices.length).toEqual(2 * 12 * 2 + 8);
    });

    it('computes right turn', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                90.0, -30.0,
                90.0, -31.0,
                91.0, -31.0
            ]),
            cornerType: CornerType.MITERED,
            width : 30000
        }));

        expect(m.attributes.position.values.length).toEqual(3 * 8);
        expect(m.indices.length).toEqual(2 * 8);
    });

    it('computes left turn', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                90.0, -30.0,
                90.0, -31.0,
                89.0, -31.0
            ]),
            cornerType: CornerType.MITERED,
            width : 30000
        }));

        expect(m.attributes.position.values.length).toEqual(3 * 8);
        expect(m.indices.length).toEqual(2 * 8);
    });

    it('computes with rounded corners', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                90.0, -30.0,
                90.0, -31.0,
                89.0, -31.0,
                89.0, -32.0
            ]),
            cornerType: CornerType.ROUNDED,
            width : 30000
        }));

        var endCaps = 180/5*2;
        var corners = 90/5*2;
        expect(m.attributes.position.values.length).toEqual(3 * (11 + endCaps + corners));
        expect(m.indices.length).toEqual(2 * (11 + endCaps + corners));
    });

    it('computes with beveled corners', function() {
        var m = CorridorOutlineGeometry.createGeometry(new CorridorOutlineGeometry({
            positions : Cartesian3.fromDegreesArray([
                 90.0, -30.0,
                 90.0, -31.0,
                 89.0, -31.0,
                 89.0, -32.0
            ]),
            cornerType: CornerType.BEVELED,
            width : 30000
        }));

        expect(m.attributes.position.values.length).toEqual(3 * 10);
        expect(m.indices.length).toEqual(2 * 10);
    });

    var positions = Cartesian3.fromDegreesArray([
         90.0, -30.0,
         90.0, -31.0
    ]);
    var corridor = new CorridorOutlineGeometry({
        positions : positions,
        cornerType: CornerType.BEVELED,
        width : 30000.0,
        granularity : 0.1
    });
    var packedInstance = [2, positions[0].x, positions[0].y, positions[0].z, positions[1].x, positions[1].y, positions[1].z];
    packedInstance.push(Ellipsoid.WGS84.radii.x, Ellipsoid.WGS84.radii.y, Ellipsoid.WGS84.radii.z);
    packedInstance.push(30000.0, 0.0, 0.0, 2.0, 0.1);
    createPackableSpecs(CorridorOutlineGeometry, corridor, packedInstance);
});