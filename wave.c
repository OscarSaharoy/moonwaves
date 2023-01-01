#include <stdio.h>
#include <math.h>

#define pi 3.14159f

float mod( float a, float b ) {
	return fmod(a, b);
}
float step( float a, float b ) {
	return b > a ? 1. : 0.;
}

void printWaveCoefficients( float m, float n ) {

	/* 
	
	w(x) = ax + b exp -mx + c exp -nx + k
	w1(x) = a - bm exp -mx - cn exp -nx

	w(0) = 1
	w(pi) = 0
	w1(0) = 0
	w1(pi) = 0

	b + c + k = 1
	a pi + b exp -mpi + c exp -npi + k = 0
	a - bm - cn = 0
	a - bm exp -mpi - cn exp -npi = 0

	 0           1           1 1   a   1
	pi    exp -mpi    exp -npi 1   b   0
	 1          -m          -n 0   c   0
	 1 -m exp -mpi -n exp -npi 0   k   0

	pi    em    en 1   a   0
	 0     1     1 1   b   1
	 1    -m    -n 0   c   0
	 1 -m em -n en 0   k   0

	pi a + em b + en c + k = 0
	1 a - m b - n c + 0 k = 0
	0 a + 1 b + 1 c + 1 k = 1
	1 a - mem b - nen c + 0 k = 0

	combine
	1*a + em/pi*b + en/pi*c + 1/pi*k = 0
	1*a - m*b - n*c + 0*k = 0

	0 a + (-m - em/pi) b + (-n -en/pi) c + -1/pi k = 0
	0 a + 1 b + (-n -en/pi)/(-m -em/pi) c + -1/pi/(-m -em/pi) k = 0
	result
	0 a + 1 b + fc c + fk k = 0

	combine
	0 a + 1 b + fc c + fk k = 0
	0 a + 1 b + 1 c + 1 k = 1

	0 a + 0 b + (fc -1) c + (fk -1) k = -1
	result
	0 a + 0 b + 1 c + (fk -1)/(fc -1) k = -1/(fc -1)

	combine
	1*a + em/pi*b + en/pi*c + 1/pi*k = 0
	1 a - mem b - nen c + 0 k = 0

	0 a + (-em/pi -mem) b + (-en/pi -nen) c - 1/pi k = 0
	0 a + 1 b + (-en/pi -nen)/(-em/pi -mem) c - 1/pi/(-em/pi -mem) k = 0
	combine
	0 a + 1 b + gc c - gk k = 0
	0 a + 1 b + fc c + fk k = 0

	0 a + 0 b + (fc - gc) c + (fk + gk) k = 0
	0 a + 0 b + 1 c + (fk - gk)/(fc - gc) k = 0
	0 a + 0 b + 0 c + ((fk -1)/(fc -1) - (fk + gk)/(fc-gc)) k = -1/(fc -1)

	k = -1/(fc -1)/((fk -1)/(fc -1) - (fk + gk)/(fc-gc))
	c = -(fk -1)/(fc -1) k -1/(fc -1)
	b = -c -k + 1
	a = -em/pi b - en/pi c - 1/pi k

	*/

	float em = exp( -m*pi );
	float en = exp( -n*pi );
	float mem = m * em;
	float nen = n * en;

	float fc = (-n -en/pi)/(-m -em/pi);
	float fk = -1./pi/(-m -em/pi);
	float gc = (-en/pi -nen)/(-em/pi -mem);
	float gk = 1./pi/(-em/pi -mem);

	float k = -1./(fc -1.)/((fk -1.)/(fc -1.) - (fk + gk)/(fc-gc));
	float c = -(fk -1.)/(fc -1.) * k -1./(fc -1.);
	float b = -c -k + 1.;
	float a = -em/pi * b - en/pi * c - 1./pi * k;

	printf("%f\n", a);
	printf("%f\n", b);
	printf("%f\n", c);
	printf("%f\n", k);
}

int main() {

	printWaveCoefficients(5, .2);
}
