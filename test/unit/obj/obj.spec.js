define([
  'obj/obj'
],
function (Obj) {
  'use strict';

  describe('obj/obj', function () {

    describe('create()', function () {
      var fooParent, fooChild, fooGrandchild;

      beforeEach(function () {
        fooParent = function () {};
        fooParent.parentProp = 'parent stuff';

        fooChild = Obj.create(fooParent);
        fooChild.childProp = 'child stuff';
        fooChild.childFunc = function () {
          return this.childProp;
        };

        fooGrandchild = Obj.create(fooChild);
        fooGrandchild.grandchildProp = 'grand child stuff';
      });

      it('creates new object from a prototype', function () {
        expect(fooChild.bar).to.equal(fooParent.bar);
      });

      it('doesnt let changes affect its prototype', function () {
        fooChild.derp = 'herp';
        expect(fooParent.derp).to.be.undefined;
      });

      it('honors isPrototypeOf()', function () {
        expect(fooParent.isPrototypeOf(fooChild)).to.equal(true);
      });

      it('honors isPrototypeOf() 2 levels down', function () {
        expect(fooParent.isPrototypeOf(fooGrandchild)).to.equal(true);
      });

      it('honors Object.getPrototypeOf()', function () {
        expect(Object.getPrototypeOf(fooChild)).to.equal(fooParent);
      });

      it('this works', function () {
        expect(fooGrandchild.childFunc()).to.equal('child stuff');
        fooGrandchild.childProp = 'new stuff';
        expect(fooGrandchild.childFunc()).to.equal('new stuff');
      });

    });

    describe('defineProperty()', function () {
      it('sets the value', function () {
        var x = {};
        Obj.defineProperty(x, 'foo', 'bar');
        expect(x.foo).to.equal('bar');
      });
    });

  });

});
